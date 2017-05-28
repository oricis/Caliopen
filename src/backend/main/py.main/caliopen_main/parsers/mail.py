# -*- coding: utf-8 -*-
"""
Caliopen mail message format management.

mail parsing is included in python, so this is not
getting external dependencies.

For formats with needs of external packages, they
must be defined outside of this one.
"""

import logging
import base64
from itertools import groupby
from mailbox import Message
from datetime import datetime
from email.utils import parsedate_tz, mktime_tz

import zope.interface

from caliopen_main.user.helpers.normalize import clean_email_address
from caliopen_main.interfaces import (IAttachmentParser, IMessageParser,
                                      IParticipantParser)
from .mail_feature import MailPrivacyFeatureProcessor


log = logging.getLogger(__name__)


class MailAttachment(object):
    """Mail part structure."""

    zope.interface.implements(IAttachmentParser)

    def __init__(self, part):
        """Extract attachment attributes from a mail part."""
        self.content_type = part.get_content_type()
        self.filename = part.get_filename()
        data = part.get_payload()
        self.size = len(data) if data else 0
        self.can_index = False
        if 'text' in part.get_content_type():
            self.can_index = True
            charsets = part.get_charsets()
            if len(charsets) > 1:
                raise Exception('Too many charset %r for %s' %
                                (charsets, part.get_payload()))
            self.charset = charsets[0]
            if 'Content-Transfer-Encoding' in part.keys():
                if part.get('Content-Transfer-Encoding') == 'base64':
                    data = base64.b64decode(data)
            if self.charset:
                data = data.decode(self.charset, 'replace'). \
                    encode('utf-8')
        self.data = data


class MailParticipant(object):
    """Mail participant parser."""

    zope.interface.implements(IParticipantParser)

    def __init__(self, type, addr):
        """Parse an email address and create a participant."""
        self.type = type
        parts = clean_email_address(addr)
        self.address = parts[0]
        self.label = parts[1]


class MailMessage(object):
    """
    Mail message structure.

    Got a mail in raw rfc2822 format, parse it to
    resolve all recipients emails, parts and group headers
    """

    zope.interface.implements(IMessageParser)

    recipient_headers = ['From', 'To', 'Cc', 'Bcc']
    message_type = 'email'
    warnings = []

    def __init__(self, raw_data):
        """Parse an RFC2822,5322 mail message."""
        self.raw = raw_data
        try:
            self.mail = Message(raw_data)
        except Exception as exc:
            log.error('Parse message failed %s' % exc)
            raise exc
        if self.mail.defects:
            # XXX what to do ?
            log.warn('Defects on parsed mail %r' % self.mail.defects)
            self.warning = self.mail.defects

    @property
    def subject(self):
        """Mail subject."""
        return self.mail.get('Subject')

    @property
    def body(self):
        """Mail body."""
        # XXX define the extraction logic for multipart and co.
        if not self.mail.is_multipart():
            return self.mail.get_payload()
        return ''

    @property
    def size(self):
        """Get mail size in bytes."""
        return len(self.mail.as_string())

    @property
    def external_references(self):
        """Return mail references to be used as ExternalReferences."""
        ext_id = self.mail.get('Message-Id')
        parent_id = self.mail.get('In-Reply-To')
        return {'message_id': ext_id,
                'parent_id': parent_id}

    @property
    def date(self):
        """Get date from a mail message."""
        mail_date = self.mail.get('Date')
        if mail_date:
            tmp_date = parsedate_tz(mail_date)
            return datetime.fromtimestamp(mktime_tz(tmp_date))
        log.debug('No date on mail using now (UTC)')
        return datetime.utcnow()

    @property
    def participants(self):
        """Mail participants."""
        participants = []
        for header in self.recipient_headers:
            addrs = []
            participant_type = header.capitalize()
            if self.mail.get(header):
                if ',' in self.mail.get(header):
                    addrs.extend(self.mail.get(header).split(','))
                else:
                    addrs.append(self.mail.get(header))
            for addr in addrs:
                participant = MailParticipant(participant_type, addr)
                participants.append(participant)
        return participants

    @property
    def attachments(self):
        """Multipart mail message, extract parts into attachments."""
        if not self.mail.is_multipart():
            return []
        parts = []
        for p in self.mail.walk():
            if not p.is_multipart():
                parts.append(MailAttachment(p))
        return parts

    @property
    def extra_parameters(self):
        """Mail message extra parameters."""
        lists = []
        for list_name in self.headers.get('List-ID', []):
            lists.append(list_name)
        return {'lists': lists}

    @property
    def privacy_features(self):
        """Mail message privacy features."""
        extractor = MailPrivacyFeatureProcessor(self)
        return extractor.process()

    def lookup_discussion_sequence(self, *args, **kwargs):
        """Return list of lookup type, value from a mail message."""
        seq = []
        # first from parent
        if self.external_references['parent_id']:
            seq.append(('parent', self.external_references['parent_id']))
        # then list lookup
        for listname in self.extra_parameters.get('lists', []):
            seq.append(('list', listname))
        # last try to lookup from sender address
        for p in self.participants:
            if p.type == 'from' and len(self.participants) == 2:
                seq.append(('from', p.address))
        return seq

    # Others parameters specific for mail message
    @property
    def headers(self):
        """
        Extract all headers into list.

        Duplicate on headers exists, group them by name
        with a related list of values
        """
        def keyfunc(item):
            return item[0]

        # Group multiple value for same headers into a dict of list
        headers = {}
        data = sorted(self.mail.items(), key=keyfunc)
        for k, g in groupby(data, key=keyfunc):
            headers[k] = [x[1] for x in g]
        return headers
