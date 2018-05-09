# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
import logging
from caliopen_main.contact.objects.contact import Contact
from caliopen_main.message.objects.message import Message
import requests
import json

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

OLD_PREFIX = '_v4'
NEW_PREFIX = '_v5'


class IndexMigrator(object):
    def __init__(self, client=None, mappings_version=None, url=None):
        self.es_client = client
        self.types = (Contact(), Message())
        self.mappings_version = mappings_version
        self.url = url

    def check_empty_index(self, index):
        stats = self.es_client.indices.stats(index)
        docs = stats['_all']['total']['docs']
        if docs['count'] != 0:
            return False
        else:
            old_index = '{}{}'.format(index[:-(len(NEW_PREFIX))], OLD_PREFIX)
            if self.es_client.indices.exists(old_index):
                log.warn('Delete the empty index {} with old version found'.
                         format(index))
                self.es_client.indices.close(index)
                self.es_client.indices.delete(index)
        return True

    def run(self):
        indexes = self.es_client.indices.get("_all")
        log.info("found {} indexes".format(len(indexes)))
        total = len(indexes)
        ok = 0
        errors = 0
        count = 1
        skip = 0
        for index in indexes:
            alias = index[:-(len(OLD_PREFIX))]
            new_index = alias + "_" + self.mappings_version
            if index.endswith(self.mappings_version):
                if not self.check_empty_index(index):
                    log.warn('Index {} already in wanted version'.
                         format(index))
                    skip += 1
                    continue

            if index.endswith(OLD_PREFIX):
                if self.es_client.indices.exists(new_index):
                    log.warn('Index {} exists, skipping'.format(new_index))
                    skip += 1
                    continue

            log.info("\nOperation {}/{}".format(count, total))
            count += 1

            try:
                self.create_new_index(new_index)
                self.copy_old_to_new(index, new_index)
            except Exception as exc:
                log.warn("Aborting migration operations for {}".format(index))
                errors += 1
                # do not try operations below if above reindexation has failed
                continue

            try:
                self.move_alias(alias, index, new_index)
                self.delete_old_index(index)
                self.es_client.indices.refresh(alias)
                self.fill_date_sort(alias)
            except Exception:
                errors += 1
                continue

            ok += 1

        log.info("{} operations completed OK : {} "
                 "Errors: {} Skip: {}".format(count, ok, errors, skip))

    def create_new_index(self, index):
        """Create user index and setups mappings."""
        log.info('Creating new index {}'.format(index))

        try:
            self.es_client.indices.create(
                index=index,
                timeout='30s',
                body={
                    "settings": {
                        "index": {
                            "number_of_shards": 3,
                        },
                        "analysis": {
                            "analyzer": {
                                "text_analyzer": {
                                    "type": "custom",
                                    "tokenizer": "lowercase",
                                    "filter": [
                                        "ascii_folding"
                                    ]
                                },
                                "email_analyzer": {
                                    "type": "custom",
                                    "tokenizer": "email_tokenizer",
                                    "filter": [
                                        "ascii_folding"
                                    ]
                                }
                            },
                            "filter": {
                                "ascii_folding": {
                                    "type": "asciifolding",
                                    "preserve_original": True
                                }
                            },
                            "tokenizer": {
                                "email_tokenizer": {
                                    "type": "ngram",
                                    "min_gram": 3,
                                    "max_gram": 25
                                }
                            }
                        }
                    }
                })
        except Exception as exc:
            log.error("failed to create index {} : {}".format(index, exc))
            raise exc

        # PUT mappings for each type
        for kls in self.types:
            kls._index_class().create_mapping(index)

    def copy_old_to_new(self, old, new):
        log.info("Copying data from {} to {}".format(old, new))

        try:
            self.es_client.reindex(timeout='1m', body={
                "source": {
                    "index": old
                },
                "dest": {
                    "index": new
                }
            }, wait_for_completion=True)
        except Exception as exc:
            log.error(
                "failed to copy index {} to {} : {}".format(old, new, exc))
            raise exc

    def delete_old_index(self, index):
        log.warn("Deleting old index {}".format(index))

        try:
            self.es_client.indices.delete(index)
        except Exception as exc:
            log.error("failed to delete old index {} : {}".format(index, exc))
            raise exc

    def move_alias(self, alias, old_index, new_index):
        log.info(
            "Moving alias {} from {} to {}".format(alias, old_index, new_index))

        try:
            self.es_client.indices.delete_alias(index=old_index, name=alias)
            self.es_client.indices.put_alias(index=new_index, name=alias)
        except Exception as exc:
            log.error("failed to move alias {} : {}".format(alias, exc))
            raise exc

    def fill_date_sort(self, index):
        """
        fill_date_sort updates all message docs in index
        with either message's date or date_insert into date_sort,
        depending of message being received or sent

        :param index: Elasticsearch index
        :return: None
        """
        log.info("filling date_sort prop for index {}".format(index))
        q = {
            "script": {
                "lang": "painless",
                "inline": "if (ctx._source.is_received) {ctx._source.date_sort = ctx._source.date_insert} else {ctx._source.date_sort = ctx._source.date}"
            }
        }
        try:
            resp = requests.post(self.url + "/" + index + "/indexed_message/_update_by_query", data=json.dumps(q), headers={'content-type': 'application/json'})
            log.info("{} docs updated in {}".format(resp.json()["updated"], index))
        except Exception as exc:
            log.error(
                "failed to update_by_query index {} : {}".format(index, exc))
