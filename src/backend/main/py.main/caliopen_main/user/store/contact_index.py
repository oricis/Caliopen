# -*- coding: utf-8 -*-
"""Caliopen contact index classes."""
from __future__ import absolute_import, print_function, unicode_literals

import logging

from elasticsearch_dsl import Mapping, Nested, Text, Keyword, Date, Boolean, \
    InnerObjectWrapper, Integer
from caliopen_storage.store.model import BaseIndexDocument
from caliopen_main.objects.pi import PIIndexModel

from .tag_index import IndexedResourceTag


log = logging.getLogger(__name__)


class IndexedOrganization(InnerObjectWrapper):

    """Contact indexed organization model."""

    organization_id = Text()
    deleted = Boolean()
    label = Text()
    department = Text()
    job_description = Text()
    name = Text()
    title = Text()
    is_primary = Boolean()
    type = Text()


class IndexedPostalAddress(InnerObjectWrapper):

    """Contact indexed postal addresse model."""

    address_id = Text()
    label = Text()
    type = Text()
    is_primary = Boolean()
    street = Text()
    city = Text()
    postal_code = Text()
    country = Text()
    region = Text()


class IndexedInternetAddress(InnerObjectWrapper):

    """Contact indexed address on internet (email, im) model."""

    address = Keyword()
    label = Text()
    is_primary = Boolean()
    type = Keyword()


class IndexedPhone(InnerObjectWrapper):

    """Contact indexed phone model."""

    number = Text()
    type = Text()
    is_primary = Boolean()
    uri = Text()


class IndexedSocialIdentity(InnerObjectWrapper):

    """Contact indexed social identity model."""

    name = Text()
    type = Text()
    # Abstract everything else in a map
    infos = Nested()


class IndexedContact(BaseIndexDocument):

    """Indexed contact model."""

    doc_type = 'indexed_contact'

    title = Text()
    given_name = Text()
    additional_name = Text()
    family_name = Text()
    name_suffix = Text()
    name_prefix = Text()
    date_insert = Date()
    privacy_index = Integer()

    organizations = Nested(doc_class=IndexedOrganization)
    addresses = Nested(doc_class=IndexedPostalAddress)
    emails = Nested(doc_class=IndexedInternetAddress)
    ims = Nested(doc_class=IndexedInternetAddress)
    phones = Nested(doc_class=IndexedPhone)
    social_identities = Nested(doc_class=IndexedSocialIdentity)
    tags = Nested(doc_class=IndexedResourceTag)

    privacy_features = Nested()
    pi = Nested(doc_class=PIIndexModel)

    @property
    def contact_id(self):
        """The compound primary key for a contact is contact_id."""
        return self.meta.id

    @classmethod
    def create_mapping(cls, user_id):
        """Create elasticsearch indexed_contacts mapping object for an user."""

        m = Mapping(cls.doc_type)
        m.meta('_all', enabled=True)
        m.field('title', Text())
        m.field('given_name', Text(index='not_analyzed'))
        m.field('additional_name', Text(index='not_analyzed'))
        m.field('family_name', Text(index='not_analyzed'))
        m.field('name_suffix', Text(index='not_analyzed'))
        m.field('name_prefix', Text(index='not_analyzed'))
        m.field('date_insert', 'date')
        m.field('privacy_index', 'short')
        emails = Nested(doc_class=IndexedInternetAddress, include_in_all=True,
                        properties={
                            "address": Keyword(),
                            "label": Text(),
                            "is_primary": Boolean(),
                            "Type": Keyword()
                        })
        m.field("emails", emails)
        m.save(using=cls.client(), index=user_id)
        return m
