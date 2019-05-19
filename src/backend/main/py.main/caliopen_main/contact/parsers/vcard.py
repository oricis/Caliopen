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


class VcardParameter(object):
    """A vcard parameter important for processing"""

    def __init__(self, param):
        self.param = param
        self.object = None

    def build(self):
        self.object = self._build()


class VcardEmail(VcardParameter):

    def _build(self, **kwargs):
        email = NewEmail()
        email.label = self.param.value
        email.address = clean_email_address(self.param.value)[0]
        if 'TYPE' in self.param.params:
            email_type = self.param.params['TYPE'][0].lower()
            if email_type in EMAIL_TYPES:
                email.type = email_type
        if 'PREF' in self.param.params:
            email.is_primary = True
        return email


class VcardIM(VcardParameter):

    def _build(self):
        im = NewIM()
        im.label = self.param.value
        im.address = clean_email_address(self.param.value)[0]
        if 'TYPE' in self.param.params and self.param.params['TYPE']:
            im_type = self.param.params['TYPE'][0].lower()
            if im_type in IM_TYPES:
                im.type = im_type
        if 'PREF' in self.param.params:
            im.is_primary = True
        return im


class VcardPhone(VcardParameter):

    def _build(self, locale=None):
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
        phone.number = self.param.value
        if 'TYPE' in self.param.params and self.param.params['TYPE']:
            phone_type = self.param.params['TYPE'][0].lower()
            if phone_type in _vcard_types:
                phone.type = _vcard_types[phone_type]
            else:
                phone.type = 'other'
        if 'PREF' in self.param.params:
            phone.is_primary = True
        try:
            number = phonenumbers.parse(phone.number, locale)
            phone_format = phonenumbers.PhoneNumberFormat.INTERNATIONAL
            normalized = phonenumbers.format_number(number, phone_format)
            if normalized:
                phone.normalized_number = normalized
        except Exception as exc:
            log.warning('Error during phone normalization {}: {}'.
                        format(phone.number, exc))
            pass
        return phone


class VcardIdentity(VcardParameter):

    def _build(self):
        social = NewSocialIdentity()
        social.type = 'twitter'
        social.name = self.param.name.lower().replace('@', '')
        return social


class VcardAddress(VcardParameter):

    def _build(self):
        adr = NewPostalAddress()
        adr.city = self.param.value.city
        adr.zip = self.param.value.code
        adr.street = self.param.value.street
        adr.region = self.param.value.region
        adr.country = self.param.value.country
        return adr


class VcardContact(object):
    """Contact from a vcard entry."""

    _meta = {}

    def __init__(self, vcard, default_locale=None):
        """Parse a vcard contact."""
        self._vcard = vcard
        self.locale = default_locale
        self.contact = None
        self.warnings = {'duplicate_phone': 0, 'duplicate_email': 0,
                         'duplicate_identity': 0, 'duplicate_im': 0}

    def parse(self):
        self._parse()

    def _get_not_empty(self, prop):
        """Get non empty value (and only value) from a vcard property."""
        if prop in self._vcard.contents:
            attr = self._vcard.contents[prop]
            if isinstance(attr, (list, tuple)):
                return [x.value for x in attr if x.value]
            return attr.value if attr.value else None
        return None

    def __parse_emails(self):
        """Read vcard email property and build NewEmail instances."""
        for param in self._vcard.contents.get('email', []):
            vcard = VcardEmail(param)
            vcard.build()
            yield vcard.object

    def __parse_phones(self):
        """Read vcard tel property and build NewPhone instances."""
        for param in self._vcard.contents.get('tel', []):
            vcard = VcardPhone(param)
            vcard.build()
            yield vcard.object

    def __parse_addresses(self):
        """Read vcard adr property and build NewPostalAddress instances."""
        for param in self._vcard.contents.get('adr', []):
            vcard = VcardAddress(param)
            vcard.build()
            yield vcard.object

    def __build_organization(self, param):
        org = NewOrganization()
        org.name = param.value[0]
        return org

    def __parse_organizations(self):
        for param in self._vcard.contents.get('org', []):
            yield self.__build_organization(param)

    def __parse_impps(self):
        for param in self._vcard.contents.get('impp', []):
            vcard = VcardIM(param)
            vcard.build()
            yield vcard.object

    def __parse_social_identities(self):
        if 'x-twitter' in self._vcard.contents:
            for ident in self._vcard.contents.get('x-twitter', []):
                vcard = VcardIdentity(ident)
                vcard.build()
                yield vcard.object

    def _deduplicate_list(self, objects, attribute_name):
        distinct_values = []
        distinct_objects = []
        duplicates = 0
        for obj in objects:
            value = getattr(obj, attribute_name)
            if value not in distinct_values:
                distinct_values.append(value)
                distinct_objects.append(obj)
            else:
                duplicates += 1
        return distinct_objects, duplicates

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

        # build list then dedup them
        warnings = self.warnings
        phones = list(self.__parse_phones())
        normalized_phones = [x.normalized_number for x in phones
                             if x.normalized_number]
        distinct_numbers = []
        for phone in phones:
            if phone.normalized_number not in normalized_phones:
                if phone.normalized_number not in distinct_numbers:
                    distinct_numbers.append(phone.normalized_number)
                    contact.phones.append(phone)
                else:
                    warnings['duplicate_phone'] += 1
            else:
                if phone.number not in distinct_numbers:
                    distinct_numbers.append(phone.number)
                    contact.phones.append(phone)
                else:
                    warnings['duplicate_phone'] += 1

        emails = list(self.__parse_emails())
        contact.emails, duplicates = self._deduplicate_list(emails, 'address')
        warnings['duplicate_email'] = duplicates

        identities = list(self.__parse_social_identities())
        if identities:
            contact.identities, duplicates = self._deduplicate_list(identities,
                                                                    'name')
            warnings['duplicate_identity'] = duplicates

        ims = list(self.__parse_impps())
        contact.ims, duplicates = self._deduplicate_list(ims, 'address')
        warnings['duplicate_im'] = duplicates

        contact.addresses = list(self.__parse_addresses())
        contact.organizations = list(self.__parse_organizations())
        self.warnings = warnings
        self.contact = contact

    def serialize(self):
        """Serialize contact."""
        data = self.contact.serialize()
        data.update({'_meta': self._meta})
        return data

    def validate(self):
        """Validate contact parsed informations."""
        return self.contact.validate()

    def all_identifiers(self):
        """Return all distinct identifiers for this contact."""
        for email in self.contact.emails:
            yield ('email', email.address)
        for im in self.contact.ims:
            yield ('im', im.address)
        for ident in self.contact.identities:
            yield (ident.type, ident.name)
        for phone in self.contact.phones:
            if phone.normalized_number:
                number = phone.normalized_number
            else:
                number = phone.number
            yield ('phone', number)


class VcardParserResult(object):
    """Result structure for a vcard parsing."""

    def __init__(self):
        self.sum_contacts = 0
        self.sum_all_contacts = 0
        self.sum_conflicts = 0
        self.conflicts = []

    def to_dict(self):
        """Dict representation of this result."""
        return {'sum_contacts': self.sum_contacts,
                'sum_all_contacts': self.sum_all_contacts,
                'sum_conflicts': self.sum_conflicts,
                'conflicts': self.conflicts}


class VcardParser(object):
    """Vcard format parser class."""

    def __init__(self, f, locale=None):
        """Read a vcard file and create a generator on vcard objects."""
        self.locale = locale
        self._vcards = vobject.readComponents(f)

    def parse(self):
        contacts = self._parse()
        result = VcardParserResult()
        known_ids = []
        distinct_contacts = []
        for contact in contacts:
            result.sum_all_contacts += 1
            contact_conflict = 0
            for ident in contact.all_identifiers():
                if ident not in known_ids:
                    known_ids.append(ident)
                else:
                    contact_conflict += 1
                    result.conflicts.append(ident)
            if not contact_conflict:
                distinct_contacts.append(contact)
                result.sum_contacts += 1
            else:
                result.sum_conflicts += contact_conflict
        self.result = result
        self.contacts = distinct_contacts
        return distinct_contacts

    def _parse(self):
        """Generator on vcards objects read from read file."""
        for vcard in self._vcards:
            contact = VcardContact(vcard, self.locale)
            contact.parse()
            yield contact
