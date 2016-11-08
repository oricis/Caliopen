from caliopen-storage.parameters import ReturnCoreObject
from caliopen-storage.user.core import User
from caliopen-storage.user.parameters import User as UserParam


class ReturnUser(ReturnCoreObject):
    """
    Return object for ``User`` core
    """

    _core_class = User
    _return_class = UserParam
