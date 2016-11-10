
from caliopen_storage.helpers.json import json, JSONEncoder


def dump_model(model, output_path, **kwargs):
    # Discover base core classes
    from caliopen_main.user.core import User
    from caliopen_storage.core import core_registry
    _exports = {
        'contact': ['Contact', 'Organization', 'PostalAddress', 'Email', 'IM',
                    'Ohone', 'PublicKey', 'SocialIdentity'],
        'message': ['Message', 'Thread'],
        'user':    ['User', 'Counter', 'Tag', 'FilterRule'],
    }
    for obj in _exports[model]:
        kls = core_registry.get(obj)
        if not kls:
            raise Exception('core class %s not found in registry' % obj)
        output_file = '%s/%s.json' % (output_path, obj.lower())
        dump_model_class(kls, output_file)


def dump_model_class(kls, output_file):
    """Dump a model class into output file."""
    records = kls._model_class.objects.all()
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
