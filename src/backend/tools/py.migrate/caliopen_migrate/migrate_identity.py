from caliopen_main.user.core import User


def fix_user_contact(user, new_domain, only_index=False):
    from caliopen_storage.exception import NotFound
    from caliopen_main.contact.objects.contact import Contact as ContactObject
    from caliopen_main.contact.objects.email import Email as EmailObject
    try:
        contact = ContactObject(user, contact_id=user.contact_id)
        contact.get_db()
        print('User contact found')
        if only_index:
            print('Recreate index')
            contact.create_index()
        return contact.unmarshall_db()
    except NotFound:
        pass
    except Exception as exc:
        print('ERROR ! Retrieving old contact {}'.format(exc))
        raise exc
    try:
        local_addr = '{}@{}'.format(user.name, new_domain)
    except UnicodeError:
        print('ERROR ! Invalid user name encoding {}'.format(user.user_id))
        return None
    obj = ContactObject(user, contact_id=user.contact_id)
    email = EmailObject(address=local_addr, type='home')
    obj.emails.append(email)
    obj.marshall_db()
    obj.save_db()
    obj.create_index()
