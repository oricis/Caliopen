from caliopen.base.parameters import ReturnCoreObject
from caliopen.base.core.user import User
from caliopen.base.parameters.user import User as UserParam


class ReturnUser(ReturnCoreObject):
    """
    Return object for ``User`` core
    """

    _core_class = User
    _return_class = UserParam
