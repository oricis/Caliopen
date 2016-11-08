from caliopen.base.parameters import ReturnCoreObject
from caliopen.base.user.core import User
from caliopen.base.user.parameters import User as UserParam


class ReturnUser(ReturnCoreObject):
    """
    Return object for ``User`` core
    """

    _core_class = User
    _return_class = UserParam
