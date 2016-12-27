# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from .base import *
from uuid import UUID
from caliopen_main.user.store.contact import (Contact as ModelContact,
                             Lookup as ModelContactLookup,
                             PublicKey as ModelPublicKey)
from caliopen_main.user.store.contact_index import IndexedContact
from caliopen_main.user.parameters.contact import Contact as ParamContact

from .email import Email
from .postal_address import PostalAddress
from .social_identity import SocialIdentity
from .im import IM
from .organization import Organization
from .phone import Phone


import logging
log = logging.getLogger(__name__)


class ContactLookup(ObjectStorable):
    """Contact lookup core class."""

    def __init__(self):
        self._model_class = ModelContactLookup
        self._pkey_name = 'value'


class PublicKey(ObjectStorable):

    def __init__(self):
        self._model_class = ModelPublicKey
        self._pkey_name = 'name'


class Contact(ObjectStorable, ObjectIndexable):

    # TODO : manage attrs that should not be modifiable directly by users
    _attrs = {
        'additional_name':     StringType,
        'addresses':           [PostalAddress],
        'avatar':              StringType,
        'contact_id':          UUID,
        'date_insert':         datetime.datetime,
        'date_update':         datetime.datetime,
        'deleted':             BooleanType,
        'emails':              [Email],
        'family_name':         StringType,
        'given_name':          StringType,
        'groups':              [StringType],
        'identities':          [SocialIdentity],
        'ims':                 [IM],
        'infos':               DictType,
        'name_prefix':         StringType,
        'name_suffix':         StringType,
        'organizations':       [Organization],
        'phones':              [Phone],
        'privacy_features':    DictType,
        'privacy_index':       IntType,
        'public_keys':         [PublicKey],
        'tags':                [StringType],
        'title':               StringType,
        'user_id':             UUID
    }

    _json_model = ParamContact

    # operations related to cassandra
    _model_class = ModelContact
    _db = None  # model instance with datas from db
    _pkey_name = "contact_id"
    _relations = {
        'public_keys': PublicKey,
    }
    _lookup_class = ContactLookup
    _lookup_values = {
        'emails': {'value': 'address', 'type': 'email'},
        'ims': {'value': 'address', 'type': 'email'},
        'phones': {'value': 'number', 'type': 'phone'},
        'social_identities': {'value': 'name', 'type': 'social'},
    }

    #  operations related to elasticsearch
    _index_class = IndexedContact

    def __init__(self):
        super(CaliopenObject, self).__init__()
