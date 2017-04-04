"""
This script parse for a user email (first arg) a mbox file (second arg)
and import mails. Contacts (recipients) involved will be lookup

User must be created before import

"""
from __future__ import absolute_import, print_function, unicode_literals

import os
import random
import logging
import smtplib

from email import message_from_file
from mailbox import mbox, Maildir

from caliopen_storage.exception import NotFound


log = logging.getLogger(__name__)


def import_email(email, import_path, format, **kwargs):

    from caliopen_main.user.core import User
    from caliopen_main.user.core import Contact, ContactLookup
    from caliopen_main.message.format.mail import MailMessage
    from caliopen_main.user.parameters import NewContact, NewEmail

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

    user = User.by_local_identity(email)

    rcpts = [email]

    log.info("Processing mode %s" % mode)
    msgs = []
    for key, mail in emails.iteritems():
        # Create contact for user
        msgs.append(MailMessage(mail))

    msgs = sorted(msgs, key=lambda msg: msg.date)
    total_msgs = len(msgs)
    for i, msg in enumerate(msgs, 1):
        log.info('Processing mail {}/{}'.format(i, total_msgs))
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
                        e_mail = NewEmail()
                        e_mail.address = alias
                        contact.emails = [e_mail]
                    contact.privacy_index = random.randint(0, 100)
                    Contact.create(user, contact)
    for i, msg in enumerate(msgs,
                            1):  # injection is made here to test smtp delivery speed
        log.info('Injecting mail {}/{}'.format(i, total_msgs))
        smtp = smtplib.SMTP(host="localhost", port=2525)
        smtp.sendmail("maibox_importer@py.caliopen.cli", rcpts,
                      msg.mail.as_string())
