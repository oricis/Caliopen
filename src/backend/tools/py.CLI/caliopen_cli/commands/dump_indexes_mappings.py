import json
from caliopen_storage.helpers.json import JSONEncoder


def dump_indexes(output_path, **kwargs):
    # Discover base core classes
    from caliopen_main.user.core import User
    from caliopen_main.contact.objects.contact import Contact
    from caliopen_main.message.objects.message import Message
    from caliopen_main.common.objects.tag import ResourceTag
    from caliopen_storage.core import core_registry
    _exports = {
        'contact': ['Contact'],
        'message': ['Message'],
    }
    for keys in _exports:
        for obj in _exports[keys]:
            kls = core_registry.get(obj)
            if not kls:
                raise Exception('core class %s not found in registry' % obj)
            output_file = '%s/%s.json' % (output_path, obj.lower())
            dump_index_mapping(kls._index_class, output_file)


def dump_index_mapping(kls, output_file):
    """Output the json definition  class."""

    m = kls.build_mapping().to_dict()
    with open(output_file, 'w') as f:
        f.write(json.dumps(m, cls=JSONEncoder,
                           indent=4, sort_keys=True))
