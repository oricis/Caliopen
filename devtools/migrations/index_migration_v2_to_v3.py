# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
import logging
from caliopen_main.contact.objects.contact import Contact
from caliopen_main.message.objects.message import Message

log = logging.getLogger(__name__)

OLD_PREFIX = '_v2'
NEW_PREFIX = '_v3'



class IndexMigrator(object):
    def __init__(self, client=None, mappings_version=None):
        self.es_client = client
        self.types = (Contact(), Message())
        self.mappings_version = mappings_version

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
        log.warn("found {} indexes".format(len(indexes)))
        total = len(indexes)
        ok = 0
        errors = 0
        count = 1
        skip = 0
        for index in indexes:
            alias = index[:-3]
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

            log.info("Operation {}/{}".format(count, total))
            count += 1
            try:
                self.create_new_index(new_index)
                self.copy_old_to_new(index, new_index)
            except Exception as exc:
                log.warn("Aborting migration operations for {}".format(index))
                errors += 1
                continue
                # do not try operations below if above reindexation has failed
            try:
                self.move_alias(alias, index, new_index)
                self.delete_old_index(index)
            except Exception:
                errors += 1
                continue

            ok += 1

        log.warn("{} operations completed OK : {} "
                 "Errors: {} Skip: {}".format(count, ok, errors, skip))

    def create_new_index(self, index):
        """Create user index and setups mappings."""
        log.warn('Creating new index {}'.format(index))

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
        log.warn("Copying data from {} to {}".format(old, new))

        try:
            self.es_client.reindex(timeout='1m', body={
                "source": {
                    "index": old
                },
                "dest": {
                    "index": new
                }
            })
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
        log.warn(
            "Moving alias {} from {} to {}".format(alias, old_index, new_index))

        try:
            self.es_client.indices.delete_alias(index=old_index, name=alias)
            self.es_client.indices.put_alias(index=new_index, name=alias)
        except Exception as exc:
            log.error("failed to move alias {} : {}".format(alias, exc))
            raise exc
