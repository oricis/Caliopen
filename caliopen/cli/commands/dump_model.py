import json
import datetime
import time
from uuid import UUID
from decimal import Decimal


class JSONEncoder(json.JSONEncoder):
    _datetypes = (datetime.date, datetime.datetime)

    def default(self, obj):
        '''Convert object to JSON encodable type.'''
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, self._datetypes):
            return time.mktime(obj.timetuple())
        if isinstance(obj, UUID):
            return str(obj)
        return super(JSONEncoder, self).default(obj)


def dump_model(model, output_path, **kwargs):
    from caliopen.storage import registry
    from caliopen.storage.data.interfaces import (IUser,
                                                  ICounter, ITag,
                                                  IFilterRule,
                                                  # IRawMail,
                                                  IMessage,
                                                  IThread,
                                                  IContact,
                                                  IContactOrganization,
                                                  IContactPostalAddress,
                                                  IContactEmail,
                                                  IContactIm,
                                                  IContactPhone,
                                                  IContactPublicKey,
                                                  IContactSocialIdentity,
                                                  )
    from caliopen.storage.index.interfaces import (IIndexedContact,
                                                   IIndexedMessage,
                                                   IIndexedThread)

    _model_map = {
        'user': IUser,
        'counter': ICounter,
        'tag': ITag,
        'filter_rule': IFilterRule,
        # 'raw': IRawMail,
        'message': IMessage,
        'thread': IThread,
        'message_index': IIndexedMessage,
        'thread_index': IIndexedThread,
        'contact': IContact,
        'organization': IContactOrganization,
        'postal_address': IContactPostalAddress,
        'email': IContactEmail,
        'im': IContactIm,
        'phone': IContactPhone,
        'public_key': IContactPublicKey,
        'social_identity': IContactSocialIdentity,
        'contact_index': IIndexedContact,

    }

    _exports = {
        'contact': ['contact', 'organization', 'postal_address', 'email', 'im',
                    'phone', 'public_key', 'social_identity', 'contact_index'],
        'message': ['message', 'thread',
                    'message_index', 'thread_index'],
        'user':    ['user', 'counter', 'tag', 'filter_rule'],
    }
    iuser = registry.get(IUser)
    all_users = [x.user_id for x in iuser.all()]
    for obj in _exports[model]:
        kls = registry.get(_model_map[obj])
        if obj.endswith('_index'):
            for user_id in all_users:
                print('Dump index %s for user %s' % (obj, user_id))
                output_file = '%s/%s_%s.json' % (output_path, user_id, obj)
                dump_user_index_class(user_id, kls, output_file)
        else:
            output_file = '%s/%s.json' % (output_path, obj)
            dump_model_class(kls, output_file)


def dump_model_class(kls, output_file):
    """Dump a model class into output file."""
    records = kls.objects.all()
    data = []
    for rec in records:
        d = {}
        for k in rec._columns.keys():
            attr = getattr(rec, k)
            if hasattr(attr, 'to_python'):
                d[k] = attr.to_python()
            else:
                d[k] = attr
        data.append(d)
    with open(output_file, 'w') as f:
        f.write(json.dumps(data, cls=JSONEncoder,
                           indent=4, sort_keys=True))


def dump_user_index_class(user_id, kls, output_file):
    """Dump an index class for a given user into output file."""
    records = kls.dump(str(user_id))
    with open(output_file, 'w') as f:
        f.write(json.dumps(records, cls=JSONEncoder,
                           indent=4, sort_keys=True))
