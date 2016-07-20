"""
This script parse for a user email (first arg) a mbox file (second arg)
and import mails. Contacts (recipients) involved will be lookup

User must be created before import

"""
from __future__ import absolute_import, print_function, unicode_literals

import os
import sys
import logging
from email import message_from_file
from mailbox import mbox, Maildir

from caliopen.base.exception import NotFound


log = logging.getLogger(__name__)


def import_email(email, import_path, format, **kwargs):

    from caliopen.base.user.core import User
    from caliopen.base.user.core import Contact, ContactLookup
    from caliopen.base.message.format.mail import MailMessage
    from caliopen.base.user.parameters import NewContact, NewEmail
    from caliopen.smtp.agent import DeliveryAgent

    if format == 'maildir':
        emails = Maildir(import_path, factory=message_from_file)
        mode = 'maildir'
    else:
        if os.path.isdir(import_path):
            mode = 'mbox_directory'
            emails = {}
            files = [f for f in os.listdir(import_path) if
                     os.path.isfile(os.path.join(import_path, f))]
            for f in files:
                try:
                    log.debug('Importing mail from file {}'.format(f))
                    with open('%s/%s' % (import_path, f)) as fh:
                        emails[f] = message_from_file(fh)
                except Exception as exc:
                    log.error('Error importing email {}'.format(exc))
        else:
            mode = 'mbox'
            emails = mbox(import_path)

    user = User.by_name(email)

    agent = DeliveryAgent()
    mailfrom = ''
    rcpts = [email]

    log.info("Processing mode %s" % mode)
    msgs = []
    for key, mail in emails.iteritems():
        # Create contact for user
        log.info('Processing mail %s' % key)
        msgs.append(MailMessage(mail))

    msgs = sorted(msgs, key=lambda msg: msg.date)

    for msg in msgs:
        for type, addresses in msg.recipients.iteritems():
            if not addresses:
                continue
            for alias, _address in addresses:
                try:
                    ContactLookup.get(user, alias)
                except NotFound:
                    log.info('Creating contact %s' % alias)
                    name, domain = alias.split('@')
                    contact = NewContact()
                    contact.family_name = name
                    if alias:
                        email = NewEmail()
                        email.address = alias
                        contact.emails = [email]
                    Contact.create(user, contact)
        res = agent.process(mailfrom, rcpts, msg.mail.as_string())
        log.info('Process result %r' % res)
