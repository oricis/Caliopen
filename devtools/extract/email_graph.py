# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import argparse
import logging
import re
import hashlib

from elasticsearch import Elasticsearch
from caliopen_storage.config import Configuration

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)
logging.basicConfig(level=logging.INFO)

mapping = '_v5'
DEFAULT_RESULT_WINDOW = 10000


def valid_uuid(uuid):
    regex = re.compile('^[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab]'
                       '[a-f0-9]{3}-?[a-f0-9]{12}\Z', re.I)
    match = regex.match(uuid)
    return bool(match)


class DataManager(object):
    def __init__(self, client=None):
        self.es_client = client
        self.url = url

    def run(self, output):
        f = open(output, 'w')
        indexes = self.es_client.indices.get("_all")
        for index in indexes:
            user_id = index.replace(mapping, '')
            if valid_uuid(user_id):
                for record in self.process_user(index):
                    f.write(';'.join(record))
                    f.write('\n')
            else:
                log.info('Not a valid uuid {}'.format(index))
        f.close()

    def process_user(self, index):
        log.info('Processing index {0}'.format(index))
        search = IndexedMessage.search(using=self.es_client,
                                       index=index)
        count = search.count()
        log.info('Have {} message to process'.format(count))
        nb = 0
        data = []
        updated_settings = False
        if count > DEFAULT_RESULT_WINDOW:
            updated_settings = True
            self._update_settings(index, count + 100)
        while nb < count:
            search = IndexedMessage.search(using=self.es_client,
                                           index=index)[nb:nb + 100]
            results = search.execute()
            for result in results:
                lines = self.process_message(result)
                if lines:
                    data.extend(lines)
            nb += 100
        if updated_settings:
            self._update_settings(index, DEFAULT_RESULT_WINDOW)
        return data

    def _update_settings(self, index, max_result_window):
        log.info('Updating index {0} settings'.format(index))
        body = {'max_result_window': max_result_window}
        self.es_client.indices.put_settings(body, index)

    def process_message(self, message):
        from_ = filter(lambda x: x['type'] == 'From',
                       message.participants)
        if from_:
            from_ = from_[0]
        else:
            return
        to = filter(lambda x: x['type'] == 'To', message.participants)
        type = 'plain'
        if 'privacy_features' in message:
            feat = message['privacy_features']
            if feat and feat['message_encrypted'] == 'True':
                type = 'crypt'
        if 'date' in message:
            date = message['date'].isoformat()
        else:
            date = ''
        for dest in to:
            hash1 = hashlib.sha256(from_['label'].encode('utf-8')).hexdigest()
            hash2 = hashlib.sha256(dest['label'].encode('utf-8')).hexdigest()
            received = 'true' if message['is_received'] else 'false'
            yield [hash1, hash2, type, date, received]


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', dest='conffile')
    parser.add_argument('-o', dest='output')
    args = parser.parse_args()

    Configuration.load(args.conffile, 'global')
    from caliopen_main.message.store.message_index import IndexedMessage

    url = Configuration('global').get('elasticsearch.url')
    client = Elasticsearch(url)
    manager = DataManager(client)
    manager.run(args.output)
