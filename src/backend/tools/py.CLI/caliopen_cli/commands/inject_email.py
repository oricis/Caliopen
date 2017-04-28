"""
This script parse for a user email (first arg) a mbox file (second arg).
and import mails. Contacts (recipients) involved will be lookup

User must be created before import

"""
from __future__ import absolute_import, print_function, unicode_literals

import os
import logging
import smtplib

from email import message_from_file
from mailbox import mbox, Maildir


log = logging.getLogger(__name__)


def inject_email(email, import_path, format, host, **kwargs):
    """Import emails for an user."""

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

    log.info("Processing mode %s" % mode)

    if ':' in host:
        host, port = host.split(':', 2)
        port = int(port)
    else:
        port = 25
    mails = emails.values()
    total_msgs = len(mails)
    log.info('Will inject mail for {} into {}:{}'.format([email], host, port))
    smtp = smtplib.SMTP(host=host, port=port)
    for i, mail in enumerate(mails, 1):
        # Create contact for user
        log.info('Injecting mail {}/{}'.format(i, total_msgs))
        smtp.sendmail("mailbox_importer@py.caliopen.cli", [email], str(mail))
