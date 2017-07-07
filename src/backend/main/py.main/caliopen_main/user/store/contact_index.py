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

    deleted = Boolean()
    department = Text()
    is_primary = Boolean()
    job_description = Text()
    label = Text()
    name = Text()
    organization_id = Keyword()
    title = Text()
    type = Keyword()


class IndexedPostalAddress(InnerObjectWrapper):
    """Contact indexed postal addresse model."""

    address_id = Keyword()
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
    email_id = Keyword()
    is_primary = Boolean()
    label = Text()
    type = Keyword()


class IndexedPhone(InnerObjectWrapper):
    """Contact indexed phone model."""

    is_primary = Boolean()
    number = Text()
    phone_id = Keyword()
    type = Keyword()
    uri = Keyword()


class IndexedSocialIdentity(InnerObjectWrapper):
    """Contact indexed social identity model."""

    name = Text()
    type = Text()
    # Abstract everything else in a map
    infos = Nested()


class IndexedContact(BaseIndexDocument):
    """Indexed contact model."""

    doc_type = 'indexed_contact'

    additional_name = Text()
    addresses = Nested(doc_class=IndexedPostalAddress)
    avatar = Keyword()
    date_insert = Date()
    date_update = Date()
    deleted = Date()
    emails = Nested(doc_class=IndexedInternetAddress)
    family_name = Text()
    given_name = Text()
    groups = Keyword(multi=True)
    identities = Nested(doc_class=IndexedSocialIdentity)
    ims = Nested(doc_class=IndexedInternetAddress)
    infos = Nested()
    name_prefix = Text()
    name_suffix = Text()
    organizations = Nested(doc_class=IndexedOrganization)
    phones = Nested(doc_class=IndexedPhone)
    pi = Nested(doc_class=PIIndexModel)
    privacy_features = Nested()
    public_key = Nested()
    tags = Nested(doc_class=IndexedResourceTag)
    title = Text()

    @property
    def contact_id(self):
        """The compound primary key for a contact is contact_id."""
        return self.meta.id

    @classmethod
    def create_mapping(cls, user_id):
        """Create elasticsearch indexed_contacts mapping object for an user."""

        m = Mapping(cls.doc_type)
        m.meta('_all', enabled=True)
        m.field('additional_name', Text(index='not_analyzed'))
        addresses = Nested(doc_class=IndexedPostalAddress, include_in_all=True,
                           properties={
                               "address_id": Keyword(),
                               "city": Text(),
                               "country": Text(),
                               "is_primary": Boolean(),
                               "label": Text(),
                               "postal_code": Text(),
                               "region": Text(),
                               "street": Text(),
                               "type": Text()
                           })
        m.field("addresses", addresses)
        m.field("avatar", Keyword())
        m.field('date_insert', Date())
        m.field("date_update", Date())
        m.field("deleted", Boolean())
        emails = Nested(doc_class=IndexedInternetAddress, include_in_all=True,
                        properties={
                            "address": Keyword(),
                            "label": Text(),
                            "is_primary": Boolean(),
                            "Type": Keyword()
                        })
        m.field("emails", emails)
        m.field('family_name', Text(index='not_analyzed'))
        m.field('given_name', Text(index='not_analyzed'))
        m.field("groups", Keyword(multi=True))
        identities = Nested(doc_class=IndexedSocialIdentity,
                            include_in_all=True,
                            properties={
                                "infos": Nested(),
                                "name": Text(),
                                "type": Text()
                            })
        m.field("identities", identities)
        ims = Nested(doc_class=IndexedInternetAddress, include_in_all=True,
                     properties={
                         "address": Keyword(),
                         "is_primary": Boolean(),
                         "label": Text(),
                         "type": Keyword()
                     })
        m.field("ims", ims)
        m.field("infos", Nested())
        m.field('name_prefix', Text(index='not_analyzed'))
        m.field('name_suffix', Text(index='not_analyzed'))
        organizations = Nested(doc_class=IndexedOrganization,
                               include_in_all=True,
                               properties={
                                   "deleted": Boolean(),
                                   "department": Text(),
                                   "is_primary": Boolean(),
                                   "job_description": Text(),
                                   "label": Text(),
                                   "name": Text(),
                                   "organization_id": Text(),
                                   "title": Text(),
                                   "type": Text()
                               })
        m.field("organizations", organizations)
        phones = Nested(doc_class=IndexedPhone, include_in_all=True,
                        properties={
                            "is_primary": Boolean(),
                            "number": Text(),
                            "type": Keyword(),
                            "uri": Keyword()
                        })
        m.field("phones", phones)
        pi = Nested(doc_class=PIIndexModel, include_in_all=True,
                    properties={
                        "comportment": Integer(),
                        "context": Integer(),
                        "date_update": Date(),
                        "technic": Integer(),
                        "version": Integer()
                    })
        m.field("pi", pi)
        m.field("privacy_features", Nested())
        m.field("public_key", Nested())
        tags = Nested(doc_class=IndexedResourceTag, include_in_all=True,
                      properties={
                          "date_insert": Date(),
                          "importance_level": Integer(),
                          "label": Text(),
                          "name": Keyword(),
                          "tag_id": Keyword(),
                          "type": Boolean()
                      })
        m.field("tags", tags)
        m.field('title', Text())

        m.save(using=cls.client(), index=user_id)
        return m
