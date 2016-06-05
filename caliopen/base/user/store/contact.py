# -*- coding: utf-8 -*-
"""Caliopen models related to contact definition."""
from __future__ import absolute_import, print_function, unicode_literals
from datetime import datetime
import uuid

from cassandra.cqlengine import columns
from cassandra.cqlengine.usertype import UserType

from caliopen.base.store.mixin import IndexedModelMixin
from caliopen.base.store.model import BaseModel

from .contact_index import IndexedContact


class Organization(UserType):

    """Contact organizations model."""
    uniq_name = 'organization_id'

    organization_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    deleted = columns.Integer(default=0)
    label = columns.Text()
    department = columns.Text()
    job_description = columns.Text()
    name = columns.Text()
    title = columns.Text()
    is_primary = columns.Integer(default=0)
    type = columns.Text()   # work, other


class PostalAddress(UserType):

    """Contact postal addresses model."""
    uniq_name = 'address_id'

    address_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    label = columns.Text()
    type = columns.Text()
    is_primary = columns.Integer(default=0)
    street = columns.Text()
    city = columns.Text()
    postal_code = columns.Text()
    country = columns.Text()
    region = columns.Text()


class Email(UserType):

    """Contact emails model."""
    uniq_name = 'address'

    address = columns.Text(primary_key=True)
    label = columns.Text()
    is_primary = columns.Integer(default=0)
    type = columns.Text()   # home, work, other


class IM(UserType):

    """Contact instant messaging adresses model."""
    uniq_name = 'address'

    address = columns.Text(primary_key=True)
    label = columns.Text()
    type = columns.Text()
    protocol = columns.Text()
    is_primary = columns.Integer(default=0)


class Phone(UserType):

    """Contact phones model."""
    uniq_name = 'number'

    number = columns.Text(primary_key=True)
    type = columns.Text()
    is_primary = columns.Integer(default=0)
    uri = columns.Text()    # RFC3966


class SocialIdentity(UserType):

    """Any contact social identity (facebook, twitter, linkedin, etc)."""
    uniq_name = 'social_id'

    social_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    name = columns.Text()
    type = columns.Text()
    # Abstract everything else in a map
    infos = columns.Map(columns.Text, columns.Text)


class Contact(BaseModel, IndexedModelMixin):

    _index_class = IndexedContact

    """Contact model."""
    user_id = columns.UUID(primary_key=True)
    contact_id = columns.UUID(primary_key=True)     # clustering key
    date_insert = columns.DateTime(default=datetime.utcnow())
    date_update = columns.DateTime()
    # Redefine, need default
    deleted = columns.Integer(default=0)
    title = columns.Text()          # computed value, read only
    # detailed name structure
    given_name = columns.Text()
    additional_name = columns.Text()
    family_name = columns.Text()
    name_prefix = columns.Text()
    name_suffix = columns.Text()
    tags = columns.List(columns.Text)
    groups = columns.List(columns.Text)
    privacy_index = columns.Integer()
    privacy_features = columns.Map(columns.Text(), columns.Text())

    # UDT
    organizations = columns.List(columns.UserDefinedType(Organization))
    postal_addresses = columns.List(columns.UserDefinedType(PostalAddress))
    emails = columns.List(columns.UserDefinedType(Email))
    ims = columns.List(columns.UserDefinedType(IM))
    phones = columns.List(columns.UserDefinedType(Phone))
    identities = columns.List(columns.UserDefinedType(SocialIdentity))

    # everything else in a map
    infos = columns.Map(columns.Text, columns.Text)


class PublicKey(BaseModel):

    """Contact public cryptographic keys model."""

    user_id = columns.UUID(primary_key=True)
    contact_id = columns.UUID(primary_key=True)     # clustering key
    name = columns.Text(primary_key=True)

    date_insert = columns.DateTime(default=datetime.utcnow())
    date_update = columns.DateTime()
    type = columns.Text()
    size = columns.Integer()
    key = columns.Text()
    expire_date = columns.DateTime()
    fingerprint = columns.Text()


class Lookup(BaseModel):

    """Lookup any information needed to recognize a user contact."""

    user_id = columns.UUID(primary_key=True)
    value = columns.Text(primary_key=True)
    contact_id = columns.UUID()
    type = columns.Text()
    lookup_id = columns.Text()
