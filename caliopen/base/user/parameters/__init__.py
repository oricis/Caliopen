# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from .user import NewUser, User, Tag, NewRule

from .types import InternetAddressType, PhoneNumberType

from .contact import Recipient, NewOrganization, Organization
from .contact import NewPostalAddress, PostalAddress
from .contact import NewEmail, Email, NewIM, IM, NewPhone, Phone
from .contact import NewSocialIdentity, SocialIdentity, NewPublicKey, PublicKey
from .contact import NewContact, Contact, ShortContact

__all__ = [
    'InternetAddressType', 'PhoneNumberType',
    'NewUser', 'User', 'Tag', 'NewRule',
    'Recipient', 'NewOrganization', 'Organization',
    'NewPostalAddress', 'PostalAddress',
    'NewEmail', 'Email', 'NewIM', 'IM', 'NewPhone', 'Phone',
    'NewSocialIdentity', 'SocialIdentity', 'NewPublicKey', 'PublicKey',
    'NewContact', 'Contact', 'ShortContact'
]
