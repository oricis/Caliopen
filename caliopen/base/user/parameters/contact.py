# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""

from schematics.models import Model
from schematics.types import (StringType, IntType,
                              URLType, EmailType, UUIDType, DateTimeType)
from schematics.types.compound import ListType, ModelType, DictType
from schematics.transforms import blacklist

ORG_TYPES = ['work', 'home']
ADDRESS_TYPES = ['work', 'home', 'other']
EMAIL_TYPES = ['work', 'home', 'other']
IM_TYPES = ['work', 'home', 'other', 'netmeeting']

PHONE_TYPES = ['assistant', 'callback', 'car', 'company_main',
               'fax', 'home', 'home_fax', 'isdn', 'main', 'mobile',
               'other', 'other_fax', 'pager', 'radio', 'telex',
               'tty_tdd', 'work', 'work_fax', 'work_mobile', 'work_pager']
# XXX : use configuration instead ?
SOCIAL_TYPES = ['facebook', 'twitter', 'google', 'github', 'bitbucket',
                'linkedin', 'ello', 'instagram', 'tumblr', 'skype']

KEY_CHOICES = ['rsa', 'gpg', 'ssh']


RECIPIENT_TYPES = ['to', 'from', 'cc', 'bcc']


class Recipient(Model):

    """Store a contact reference and one of it's address used in a message."""

    address = StringType(required=True)
    type = StringType(required=True, choices=RECIPIENT_TYPES)
    contact_id = UUIDType()


class NewOrganization(Model):

    """Input structure for a new organization."""

    label = StringType(required=True)
    department = StringType()
    job_description = StringType()
    name = StringType(required=True)
    title = StringType()
    # XXX Add enumerated list
    type = StringType(choices=ORG_TYPES)
    is_primary = IntType(default=0)


class Organization(NewOrganization):

    """Existing organization."""

    user_id = UUIDType()
    contact_id = UUIDType()
    organization_id = UUIDType(required=True)
    date_insert = DateTimeType(required=True)
    date_update = DateTimeType()
    deleted = IntType(default=0)

    class Options:
        roles = {'default': blacklist('user_id', 'contact_id')}


class NewPostalAddress(Model):

    """Input structure for a new postal address."""

    address_id = StringType()
    label = StringType()
    type = StringType(choices=ADDRESS_TYPES)
    street = StringType()
    city = StringType(required=True)
    postal_code = StringType()
    country = StringType()
    region = StringType()


class PostalAddress(NewPostalAddress):

    """Existing postal address."""

    user_id = UUIDType()
    contact_id = UUIDType()
    address_id = UUIDType(required=True)
    date_insert = DateTimeType(required=True)
    date_update = DateTimeType()

    class Options:
        roles = {'default': blacklist('user_id', 'contact_id')}


class NewEmail(Model):

    """Input structure for a new email."""
    address = EmailType(required=True)
    label = StringType()
    is_primary = IntType(default=0)
    type = StringType(choices=EMAIL_TYPES, default='other')


class Email(NewEmail):

    """Existing email."""

    user_id = UUIDType()
    contact_id = UUIDType()
    date_insert = DateTimeType(required=True)
    date_update = DateTimeType()

    class Options:
        roles = {'default': blacklist('user_id', 'contact_id')}


class NewIM(Model):

    """Input structure for a new IM."""

    address = EmailType(required=True)
    label = StringType()
    is_primary = IntType(default=0)
    type = StringType(choices=IM_TYPES, default='other')
    protocol = StringType()


class IM(NewIM):

    """Existing IM."""

    user_id = UUIDType()
    contact_id = UUIDType()
    date_insert = DateTimeType(required=True)
    date_update = DateTimeType()

    class Options:
        roles = {'default': blacklist('user_id', 'contact_id')}


class NewPhone(Model):

    """Input structure for a new phone."""

    number = StringType(required=True)
    type = StringType(choices=PHONE_TYPES, default='other')
    is_primary = IntType(default=0)
    uri = URLType()


class Phone(NewPhone):

    """Existing phone."""

    user_id = UUIDType()
    contact_id = UUIDType()
    date_insert = DateTimeType(required=True)
    date_update = DateTimeType()

    class Options:
        roles = {'default': blacklist('user_id', 'contact_id')}


class NewSocialIdentity(Model):

    """Input structure for a new social identity."""

    name = StringType(required=True)
    type = StringType(choices=SOCIAL_TYPES)
    infos = DictType(StringType,
                     default=lambda: {})


class SocialIdentity(NewSocialIdentity):

    """Existing social identity."""

    user_id = UUIDType()
    contact_id = UUIDType()
    date_insert = DateTimeType(required=True)
    date_update = DateTimeType()

    class Options:
        roles = {'default': blacklist('user_id', 'contact_id')}


class NewPublicKey(Model):

    """Input structure for a new public key."""

    name = StringType(required=True)
    type = StringType(choices=KEY_CHOICES)
    size = IntType()
    key = StringType(required=True)
    fingerprint = StringType()
    expire_date = DateTimeType()


class PublicKey(NewPublicKey):

    """Existing public key."""

    user_id = UUIDType()
    contact_id = UUIDType()
    date_insert = DateTimeType(required=True)
    date_update = DateTimeType()

    class Options:
        roles = {'default': blacklist('user_id', 'contact_id')}


class NewContact(Model):

    """Input structure for a new contact."""

    given_name = StringType()
    additional_name = StringType()
    family_name = StringType()
    name_suffix = StringType()
    name_prefix = StringType()
    tags = ListType(StringType)
    groups = ListType(StringType)
    infos = DictType(StringType)
    privacy_features = DictType(StringType, default=lambda: {})

    organizations = ListType(ModelType(NewOrganization),
                             default=lambda: [])
    addresses = ListType(ModelType(NewPostalAddress),
                         default=lambda: [])
    emails = ListType(ModelType(NewEmail),
                      default=lambda: [])
    ims = ListType(ModelType(NewIM),
                   default=lambda: [])
    phones = ListType(ModelType(NewPhone),
                      default=lambda: [])
    identities = ListType(ModelType(NewSocialIdentity),
                          default=lambda: [])
    public_keys = ListType(ModelType(NewPublicKey),
                           default=lambda: [])


class Contact(NewContact):

    """Existing contact."""
    user_id = UUIDType(required=True)
    contact_id = UUIDType(required=True)
    privacy_index = IntType(default=0)
    # XXX not such default here
    title = StringType()
    avatar = StringType(default='avatar.png')

    organizations = ListType(ModelType(Organization),
                             default=lambda: [])
    addresses = ListType(ModelType(PostalAddress),
                         default=lambda: [])
    emails = ListType(ModelType(Email),
                      default=lambda: [])
    ims = ListType(ModelType(IM),
                   default=lambda: [])
    phones = ListType(ModelType(Phone),
                      default=lambda: [])
    identities = ListType(ModelType(SocialIdentity),
                          default=lambda: [])
    public_keys = ListType(ModelType(PublicKey),
                           default=lambda: [])
    deleted = IntType()
    date_insert = DateTimeType()
    date_update = DateTimeType()

    class Options:
        roles = {'default': blacklist('user_id')}

class ShortContact(Model):

    """Input structure for contact in short form."""

    contact_id = UUIDType(required=True)
    title = StringType()
    given_name = StringType()
    family_name = StringType()
    tags = ListType(StringType)
