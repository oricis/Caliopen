import logging
import os

log = logging.getLogger(__name__)


def import_vcard(username, directory, file_vcard, **kwargs):

    from caliopen_main.contact.core import Contact as CoreContact
    from caliopen_main.user.core.user import User as CoreUser

    from caliopen_main.contact.parsers import VcardParser

    new_contacts = []
    if directory:
        files = [f for f in os.listdir(directory) if
                 os.path.isfile(os.path.join(directory, f))]
        for f in files:
            ext = f.split('.')[-1]
            if ext == 'vcard' or ext == 'vcf':
                file = '{directory}/{file}'.format(directory=directory, file=f)
                parser = VcardParser(file)
                new_contacts.extend(parser.parse())
            else:
                log.warn("Not valid file extension for vcard %s" % f)

    if file_vcard:
        parser = VcardParser(file_vcard)
        new_contacts = parser.parse()

    user = CoreUser.by_name(username)

    for contact in new_contacts:
        CoreContact.create(user, contact.contact)
