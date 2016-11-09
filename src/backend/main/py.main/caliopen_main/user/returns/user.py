from caliopen_storage.parameters import ReturnCoreObject
from ..core import User
from ..parameters import User as UserParam


class ReturnUser(ReturnCoreObject):
    """
    Return object for ``User`` core
    """

    _core_class = User
    _return_class = UserParam
