"""
This script parse for a local user email (1st arg) and a text file (2nd arg).
Text file SHOULD be an RFC5322 email, with or without embedded attachment.
It will be streamed to lmtpd (aka 'broker' in docker stack).

User must be created before import

"""
from __future__ import absolute_import, print_function, unicode_literals

import smtplib
import logging

log = logging.getLogger(__name__)


def inject_email(recipient, email, **kwargs):
    """Inject an email for an user."""

    with open(email) as f:
        conn = smtplib.SMTP('localhost', 2525)
        try:
            conn.sendmail("inject_email@py.cli.caliopen", [recipient],
                          str(f.read()))
        except Exception as exc:
            log.exception(exc)
        conn.quit()
