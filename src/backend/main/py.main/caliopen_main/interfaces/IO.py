import zope.interface

"""
marshall functions transform a core object to something expected by counterpart
unMarshall func transform something coming from counterpart to a core object
"""


class JsonDictIO(zope.interface.Interface):
    """json dict is a dict ready to be serialized into a json

    ie : attr values are only str, int, bool or None
    """

    def marshall_json_dict(**options):
        pass

    def unmarshall_json_dict(**options):
        pass


class ProtobufIO(zope.interface.Interface):
    """IO between caliopen's objects and protobuf objects"""

    def marshall_protobuf(**options):
        pass

    def unmarshall_protobuf(message, **options):
        pass


class DictIO(zope.interface.Interface):
    def marshall_dict(**options):
        pass

    def unmarshall_dict(document, **options):
        pass


class JsonIO(zope.interface.Interface):
    """json is an array of bytes"""

    def marshall_json(**options):
        pass

    def unmarshall_json(document, **options):
        pass



