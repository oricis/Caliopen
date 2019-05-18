"""Caliopen vcard format parser."""

import logging
import vobject
import phonenumbers

from caliopen_main.common.helpers.normalize import clean_email_address
from caliopen_main.contact.parameters import NewContact, NewEmail, EMAIL_TYPES
from caliopen_main.contact.parameters import NewIM, IM_TYPES, NewPhone
from caliopen_main.contact.parameters import NewSocialIdentity
from caliopen_main.contact.parameters import NewPostalAddress, NewOrganization

log = logging.getLogger(__name__)


class VcardContact(object):
    """Contact from a vcard entry."""

    _meta = {}

    def __init__(self, vcard, default_locale=None):
        """Parse a vcard contact."""
        self._vcard = vcard
        self.locale = default_locale
        self._parse()

    def _get_not_empty(self, prop):
        """Get non empty value (and only value) from a vcard property."""
        if prop in self._vcard.contents:
            attr = self._vcard.contents[prop]
            if isinstance(attr, (list, tuple)):
                return [x.value for x in attr if x.value]
            return attr.value if attr.value else None
        return None

    def __build_email(self, param):
        email = NewEmail()
        email.label = param.value
        email.address = clean_email_address(param.value)[0]
        if 'TYPE' in param.params:
            email_type = param.params['TYPE'][0].lower()
            if email_type in EMAIL_TYPES:
                email.type = email_type
        if 'PREF' in param.params:
            email.is_primary = True
        return email

    def __parse_emails(self):
        """Read vcard email property and build NewEmail instances."""
        for param in self._vcard.contents.get('email', []):
            yield self.__build_email(param)

    def __build_phone(self, param):
        # XXX TOFIX
        _vcard_types = {
            'text': 'other',
            'voice': 'other',
            'fax': 'fax',
            'cell': 'mobile',
            'video': 'other',
            'pager': 'pager',
            'textphone': 'other',
        }

        phone = NewPhone()
        phone.number = param.value
        if 'TYPE' in param.params and param.params['TYPE']:
            phone_type = param.params['TYPE'][0].lower()
            if phone_type in _vcard_types:
                phone.type = _vcard_types[phone_type]
            else:
                phone.type = 'other'
        if 'PREF' in param.params:
            phone.is_primary = True
        try:
            number = phonenumbers.parse(phone.number, self.locale)
            phone_format = phonenumbers.PhoneNumberFormat.INTERNATIONAL
            normalized = phonenumbers.format_number(number, phone_format)
            if normalized:
                phone.normalized_number = normalized
        except:
            pass
        return phone

    def __parse_phones(self):
        """Read vcard tel property and build NewPhone instances."""
        for param in self._vcard.contents.get('tel', []):
            yield self.__build_phone(param)

    def __build_address(self, param):
        adr = NewPostalAddress()
        adr.city = param.value.city
        adr.zip = param.value.code
        adr.street = param.value.street
        adr.region = param.value.region
        adr.country = param.value.country
        return adr

    def __parse_addresses(self):
        """Read vcard adr property and build NewPostalAddress instances."""
        for param in self._vcard.contents.get('adr', []):
            yield self.__build_address(param)

    def __build_organization(self, param):
        org = NewOrganization()
        org.name = param.value[0]
        return org

    def __parse_organizations(self):
        for param in self._vcard.contents.get('org', []):
            yield self.__build_organization(param)

    def __build_im(self, param):
        im = NewIM()
        im.address = param.value
        if 'TYPE' in param.params and param.params['TYPE']:
            im_type = param.params['TYPE'][0].lower()
            if im_type in IM_TYPES:
                im.type = im_type
        if 'PREF' in param.params:
            im.is_primary = True
        return im

    def __parse_impps(self):
        for param in self._vcard.contents.get('impp', []):
            yield self.__build_im(param)

    def __parse_social_identities(self):
        idents = []
        if 'x-twitter' in self._vcard.contents:
            for ident in self._vcard.contents.get('x-twitter', []):
                social = NewSocialIdentity()
                social.type = 'twitter'
                social.name = ident.value
                idents.append(social)
        return idents

    def _parse(self):
        contact = NewContact()
        if 'n' in self._vcard.contents:
            contact.given_name = self._vcard.n.value.given
            contact.family_name = self._vcard.n.value.family
            contact.title = '{0} {1}'.format(contact.given_name,
                                             contact.family_name)
        elif 'fn' in self._vcard.contents:
            contact.title = self._vcard.fn.value
        elif 'cn' in self._vcard.contents:
            contact.title = self._vcard.contents['cn'][0].value
        elif self._vcard.contents.get('email'):
            contact.title = self._vcard.contents['email'][0].value

        if not contact.infos:
            contact.infos = {}
        for prop in ['nickname']:
            value = self._get_not_empty(prop)
            if value and len(value):
                contact.infos[prop] = value[0]
        for prop in ['uid', 'rev']:
            value = self._get_not_empty(prop)
            if value:
                self._meta[prop] = value

        contact.phones = self.__parse_phones()
        contact.emails = self.__parse_emails()
        contact.addresses = self.__parse_addresses()
        contact.organizations = self.__parse_organizations()
        contact.ims = self.__parse_impps()
        contact.identities = self.__parse_social_identities()
        self.contact = contact

    def serialize(self):
        """Serialize contact."""
        data = self.contact.serialize()
        data.update({'_meta': self._meta})
        return data

    def validate(self):
        """Validate contact parsed informations."""
        return self.contact.validate()


class VcardParser(object):
    """Vcard format parser class."""

    def __init__(self, f, locale=None):
        """Read a vcard file and create a generator on vcard objects."""
        self.locale = locale
        self._vcards = vobject.readComponents(f)

    def parse(self):
        """Generator on vcards objects read from read file."""
        for vcard in self._vcards:
            yield VcardContact(vcard, self.locale)
