# -*- coding: utf-8 -*-
"""Caliopen contact core classes."""
from __future__ import absolute_import, print_function, unicode_literals

import logging
import uuid
from datetime import datetime

from ..store.contact import (Contact as ModelContact,
                             Lookup as ModelContactLookup,
                             PublicKey as ModelPublicKey)

from caliopen.base.core import BaseCore, BaseUserCore
from caliopen.base.core.mixin import MixinCoreRelation, MixinCoreIndex

log = logging.getLogger(__name__)


class ContactLookup(BaseUserCore):

    """Contact lookup core class."""

    _model_class = ModelContactLookup
    _pkey_name = 'value'


class BaseContactSubCore(BaseCore):
    """
    Base core object for contact related objects
    """

    @classmethod
    def create(cls, user, contact, **kwargs):
        obj = cls._model_class.create(user_id=user.user_id,
                                      contact_id=contact.contact_id,
                                      **kwargs)
        return cls(obj)

    @classmethod
    def get(cls, user, contact, value):
        kwargs = {cls._pkey_name: value}
        try:
            obj = cls._model_class.get(user_id=user.user_id,
                                       contact_id=contact.contact_id,
                                       **kwargs)
            return cls(obj)
        except Exception:
            return None

    @classmethod
    def find(cls, user, contact, filters=None):
        q = cls._model_class.filter(user_id=user.user_id). \
            filter(contact_id=contact.contact_id)
        if not filters:
            objs = q
        else:
            objs = q.filter(**filters)
        return {'total': len(objs), 'data': [cls(x) for x in objs]}

    def to_dict(self):
        return {col: getattr(self, col)
                for col in self._model_class._columns.keys()}


class PublicKey(BaseContactSubCore):
    _model_class = ModelPublicKey
    _pkey_name = 'name'


class Contact(BaseUserCore, MixinCoreRelation, MixinCoreIndex):

    _model_class = ModelContact
    _pkey_name = 'contact_id'

    _relations = {
        'public_keys': PublicKey,
    }

    _lookup_class = ContactLookup
    _lookup_objects = ['emails', 'ims', 'phones', 'social_identities']

    @property
    def user(self):
        # XXX TOFIX we should not be there, bad design
        from .user import User
        return User.get(self.user_id)

    @classmethod
    def _compute_title(cls, contact):
        elmts = []
        elmts.append(contact.name_prefix) if contact.name_prefix else None
        elmts.append(contact.name_suffix) if contact.name_suffix else None
        elmts.append(contact.given_name) if contact.given_name else None
        elmts.append(contact.additional_name) if \
            contact.additional_name else None
        elmts.append(contact.family_name) if contact.family_name else None
        # XXX may be empty, got info from related infos
        return " ".join(elmts)

    @classmethod
    def create(cls, user, contact, **related):
        # XXX do sanity check about only one primary for related objects
        # XXX check no extra arguments in related than relations
        contact.validate()
        for k, v in related.iteritems():
            if k in cls._relations:
                [x.validate() for x in v]
            else:
                raise Exception('Invalid argument to contact.create : %s' % k)
        # XXX check and format tags and groups
        title = cls._compute_title(contact)
        contact_id = uuid.uuid4()
        o = cls._model_class.create(user_id=user.user_id,
                                    contact_id=contact_id,
                                    infos=contact.infos,
                                    tags=contact.tags, groups=contact.groups,
                                    date_insert=datetime.utcnow(),
                                    given_name=contact.given_name,
                                    additional_name=contact.additional_name,
                                    family_name=contact.family_name,
                                    prefix_name=contact.name_prefix,
                                    suffix_name=contact.name_suffix,
                                    title=title,
                                    organizations=contact.organizations,
                                    postal_addresses=contact.postal_addresses,
                                    emails=contact.emails,
                                    ims=contact.ims,
                                    social_identities=contact.social_identities
                                    )
        c = cls(o)
        log.debug('Created contact %s' % c.contact_id)
        # Create relations
        related_cores = {}
        for k, v in related.iteritems():
            if k in cls._relations:
                for obj in v:
                    log.debug('Processing object %r' % obj)
                    # XXX check only one is_primary per relation using it
                    new_core = cls._relations[k].create(user, c, **obj)
                    related_cores.setdefault(k, []).append(new_core.to_dict())
                    log.debug('Created core %r' % new_core)
                    if k in cls._lookup_objects:
                        look = ContactLookup.create(user_id=user.user_id,
                                                    value=new_core.get_id(),
                                                    contact_id=c.contact_id,
                                                    type=k,
                                                    lookup_id=new_core.get_id()
                                                    )
                        log.debug('Created lookup %r of type %s' %
                                  (look, k))
        # Index contact and related objects
        c.create_index()
        return c

    @classmethod
    def lookup(cls, user, value):
        lookup = ContactLookup.get(user, value)
        if lookup:
            return cls.get(user, lookup.contact_id)
        # XXX something else to do ?
        return None

    def delete(self):
        if self.user.contact_id == self.contact_id:
            raise Exception("Can't delete contact related to user")
        return super(Contact, self).delete()

    @property
    def public_keys(self):
        """Return detailed public keys."""
        return self._expand_relation('public_keys')

    # MixinCoreRelation methods
    def add_organization(self, organization):
        return self._add_relation('organizations', organization)

    def delete_organization(self, organization_id):
        return self._delete_relation('organizations', organization_id)

    def add_address(self, address):
        return self._add_relation('postal_addresses', address)

    def delete_address(self, address_id):
        return self._delete_relation('postal_addresses', address_id)

    def add_email(self, email):
        return self._add_relation('emails', email)

    def delete_email(self, email_addr):
        return self._delete_relation('emails', email_addr)

    def add_im(self, im):
        return self._add_relation('ims', im)

    def delete_im(self, im_addr):
        return self._delete_relation('ims', im_addr)

    def add_phone(self, phone):
        return self._add_relation('phones', phone)

    def delete_phone(self, phone_num):
        return self._delete_relation('phones', phone_num)

    def add_social_identity(self, identity):
        return self._add_relation('social_identities', identity)

    def delete_social_identity(self, identity_name):
        return self._delete_relation('social_identities', identity_name)

    def add_public_key(self, key):
        # XXX Compute fingerprint and check key validity
        return self._add_relation('public_keys', key)

    def delete_public_key(self, key_id):
        return self._delete_relation('public_keys', key_id)
