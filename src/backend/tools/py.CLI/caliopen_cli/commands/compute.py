"""Launch of nasic compute on caliopen platform."""
from __future__ import absolute_import, print_function, unicode_literals

import logging


log = logging.getLogger(__name__)


def basic_compute(username, job, ** kwargs):
    """Import emails for an user."""
    from caliopen_main.user.core import User
    from caliopen_main.contact.objects import Contact
    from caliopen_pi.qualifiers import ContactMessageQualifier

    user = User.by_name(username)
    qualifier = ContactMessageQualifier(user)
    contacts = Contact.list_db(user.user_id)

    if job == 'contact_privacy':
        for contact in contacts:
            log.info('Processing contact {0}'.format(contact.contact_id))
            qualifier.process(contact)
