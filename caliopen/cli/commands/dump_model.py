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
    from caliopen.storage.data.interfaces import IUser
    from caliopen.storage.data.interfaces import IMessage

    _model_map = {
        'user': IUser,
        'message': IMessage,
    }

    kls_name = _model_map[model]
    kls = registry.get(kls_name)
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
    with open('%s/%s.json' % (output_path, model), 'w') as f:
        f.write(json.dumps(data, cls=JSONEncoder,
                           indent=4, sort_keys=True))
