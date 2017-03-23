# -*- coding: utf-8 -*-
"""Caliopen message index classes."""
from __future__ import absolute_import, print_function, unicode_literals

import elasticsearch_dsl as dsl
from caliopen_storage.store.model import BaseIndexDocument
from caliopen_main.user.store.tag_index import IndexedResourceTag
from caliopen_main.message.store.attachment_index import \
    IndexedMessageAttachment
from caliopen_main.message.store.external_references_index import \
    IndexedExternalReferences
from caliopen_main.user.store.local_identity_index import IndexedIdentity
from caliopen_main.message.store.participant_index import IndexedParticipant
from caliopen_main.user.store.privacy_features_index import \
    IndexedPrivacyFeatures


class IndexedMessage(BaseIndexDocument):
    """Contact indexed message model."""

    doc_type = 'indexed_message'

    attachments = dsl.Nested(doc_class=IndexedMessageAttachment)
    body = dsl.String()
    date = dsl.Date()
    date_delete = dsl.Date()
    date_insert = dsl.Date()
    discussion_id = dsl.String()
    external_references = dsl.Nested(doc_class=IndexedExternalReferences)
    identities = dsl.Nested(doc_class=IndexedIdentity)
    importance_level = dsl.Integer()
    is_answered = dsl.Boolean()
    is_draft = dsl.Boolean()
    is_unread = dsl.Boolean()
    message_id = dsl.String()
    parent_id = dsl.String()
    participants = dsl.Nested(doc_class=IndexedParticipant)
    privacy_features = dsl.Nested(IndexedPrivacyFeatures)
    raw_msg_id = dsl.String()
    subject = dsl.String()
    tags = dsl.Nested(doc_class=IndexedResourceTag)
    type = dsl.String()

    @property
    def message_id(self):
        """The compound primary key for a message is message_id."""
        return self.meta.id

    @classmethod
    def create_mapping(cls, user_id):
        """Create elasticsearch mapping object for an user."""
        m = dsl.Mapping(cls.doc_type)
        m.meta('_all', enabled=False)
        m.field('attachments', dsl.Nested(doc_class=IndexedMessageAttachment,
                                          include_in_all=True))
        m.field('body', 'string')
        m.field('date', 'date')
        m.field('date_delete', 'date')
        m.field('date_insert', 'date')
        m.field('discussion_id', dsl.String(index='not_analyzed'))
        m.field('external_references',
                dsl.Nested(doc_class=IndexedExternalReferences,
                           include_in_all=True))
        m.field('identities',
                dsl.Nested(doc_class=IndexedIdentity, include_in_all=True))
        m.field('importance_level', 'short')
        m.field('is_answered', 'boolean')
        m.field('is_draft', 'boolean')
        m.field('is_unread', 'boolean')
        m.field('message_id', dsl.String(index='not_analyzed'))
        m.field('parent_id', dsl.String(index='not_analyzed'))
        m.field('participants',
                dsl.Nested(doc_class=IndexedParticipant, include_in_all=True))
        m.field('privacy_features', dsl.Nested(doc_class=IndexedPrivacyFeatures,
                                               include_in_all=True))
        m.field('raw_msg_id', dsl.String(index='not_analyzed'))
        m.field('subject', 'string')
        m.field('tags',
                dsl.Nested(doc_class=IndexedResourceTag, include_in_all=True))
        m.field('type', dsl.String(index='not_analyzed'))
        m.save(using=cls.client(), index=user_id)
        return m
