# -*- coding: utf-8 -*-
"""Caliopen functions for histogram informations from index."""
from __future__ import absolute_import, print_function, unicode_literals

import elasticsearch_dsl as dsl

from caliopen_storage.helpers.connection import get_index_connection


class ParticipantHistogram(object):
    """Date histogram for a participant in user messages index."""

    def __init__(self, user_id, resolution='day'):
        """Instanciate a date histrogram for an user."""
        self.esclient = get_index_connection()
        self.user_id = user_id
        self.resolution = resolution

    def _do_query(self, value, term):
        search = dsl.Search(using=self.esclient, index=self.user_id,
                            doc_type='indexed_message')
        term_query = dsl.Q('term', **{term: value})
        search = search.query('nested', path='participants',
                              score_mode='avg',
                              query=term_query)

        search.aggs.bucket('messages_with_value', 'date_histogram',
                           field='date', interval=self.resolution)

        r = search.execute()
        return r.aggregations.messages_with_value['buckets']

    def find_by_address(self, address):
        """Build a date histogram with a participant address."""
        return self._do_query(address, term='participants.address')

    def find_by_contact_id(self, contact_id):
        """Build a date histogram with a know contact."""
        return self._do_query(contact_id, term='participants.contact_id')
