from caliopen.base.parameters import ReturnCoreObject, ReturnIndexObject

from caliopen.base.core.contact import (
    Contact, IndexedContact, Email,
    Phone, IM, Organization, PublicKey,
    PostalAddress, SocialIdentity,
    )
from caliopen.base.parameters.contact import (
    Contact as ContactParam,
    ShortContact as ContactShortParam,
    Email as EmailParam,
    Phone as PhoneParam,
    IM as IMParam,
    Organization as OrganizationParam,
    PublicKey as PublicKeyParam,
    PostalAddress as PostalAddressParam,
    SocialIdentity as SocialIdentityParam)


class ReturnContact(ReturnCoreObject):

    _core_class = Contact
    _return_class = ContactParam


class ReturnShortContact(ReturnCoreObject):

    _core_class = Contact
    _return_class = ContactShortParam


class ReturnIndexContact(ReturnIndexObject):
    _index_class = IndexedContact
    _return_class = ContactParam


class ReturnIndexShortContact(ReturnIndexObject):
    _index_class = IndexedContact
    _return_class = ContactShortParam


class ReturnEmail(ReturnCoreObject):

    _core_class = Email
    _return_class = EmailParam


class ReturnIM(ReturnCoreObject):

    _core_class = IM
    _return_class = IMParam


class ReturnPhone(ReturnCoreObject):

    _core_class = Phone
    _return_class = PhoneParam


class ReturnAddress(ReturnCoreObject):

    _core_class = PostalAddress
    _return_class = PostalAddressParam


class ReturnPublicKey(ReturnCoreObject):

    _core_class = PublicKey
    _return_class = PublicKeyParam


class ReturnSocialIdentity(ReturnCoreObject):

    _core_class = SocialIdentity
    _return_class = SocialIdentityParam


class ReturnOrganization(ReturnCoreObject):

    _core_class = Organization
    _return_class = OrganizationParam
