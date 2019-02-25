# -*- coding: utf-8 -*-
"""Caliopen class for creating and preparing data for the tagger manager"""
from __future__ import absolute_import, print_function, unicode_literals
from caliopen_data import FileDataProvider, ESProvider
import elasticsearch_dsl as dsl
from ..utils import pre_process


class UsenetDataManager(FileDataProvider):
    @classmethod
    def _format_item(cls, item):
        # The usenet data is already pre-processed
        return item


class ESDataManager(ESProvider):
    @classmethod
    def _format_item(cls, item):
        labels = " ".join(
            ["__label__" + t.replace(" ", "_") for t in item.tags]
        )
        html_text = item.body_plain.encode("utf-8")
        text_pre = pre_process(html_text, html=True)
        return "{0} {1}".format(labels, text_pre)

    def get_query(self):
        query = dsl.Search()
        query = query.filter('exists', field='tags')
        query = query.using(self._store).doc_type('indexed_message')
        return query


class MultipleSourceDataManager(object):
    def __init__(self, providers):
        self.providers = providers

    def next(self):
        for provider in self.providers:
            for item in provider.next():
                yield item
