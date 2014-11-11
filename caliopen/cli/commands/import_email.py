"""
This script parse for a user email (first arg) a mbox file (second arg)
and import mails. Contacts (recipients) involved will be lookup

User must be created before import

"""
import os
import logging
from email import message_from_file
from os import listdir
from mailbox import mbox, Maildir

from caliopen.storage.exception import NotFound


log = logging.getLogger(__name__)


def import_email(email, import_path, format, **kwargs):

    from caliopen.core.user import User
    from caliopen.core.contact import Contact, ContactLookup
    from caliopen.core.mail import MailMessage
    from caliopen.core.parameters.contact import NewContact, NewEmail
    from caliopen.smtp.agent import DeliveryAgent

    AVATAR_DIR = '../../../caliopen.ng/src/assets/images/avatars'

    if format == 'maildir':
        emails = Maildir(import_path, factory=message_from_file)
        mode = 'maildir'
    else:
        if os.path.isdir(import_path):
            mode = 'mbox_directory'
            emails = {}
            files = [f for f in listdir(import_path) if
                     os.path.isfile(os.path.join(import_path, f))]
            for f in files:
                with open('%s/%s' % (import_path, f)) as fh:
                    emails[f] = message_from_file(fh)
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
                    infos = {'mail': alias}
                    name, domain = alias.split('@')

                    if os.path.isfile('%s/%s.png' % (AVATAR_DIR, name)):
                        infos.update({'avatar': '%s.png' % name})
                    contact = NewContact()
                    contact.family_name = name
                    email = NewEmail()
                    email.address = alias
                    Contact.create(user, contact, emails=[email])
        res = agent.process(mailfrom, rcpts, msg.mail.as_string())
        log.info('Process result %r' % res)
