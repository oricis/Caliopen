"""Caliopen core base class for objects belong to an user."""

from caliopen_storage.core import BaseCore
from caliopen_storage.exception import NotFound


class BaseUserCore(BaseCore):
    """Used by objects related to only one user (most core)."""

    _user = None

    @property
    def user(self):
        """Return user related to this object."""
        from caliopen_main.user.core import User

        if not self._user:
            self._user = User.get(self.user_id)
        return self._user

    @classmethod
    def get(cls, user, obj_id):
        """Get a core object belong to user, with model related id."""
        param = {cls._pkey_name: obj_id}
        obj = cls._model_class.get(user_id=user.user_id, **param)
        if obj:
            return cls(obj)
        raise NotFound('%s #%s not found for user %s' %
                       (cls.__class__.name, obj_id, user.user_id))

    @classmethod
    def get_by_user_id(cls, user_id, obj_id):
        """Get a core object belong to user, with model related id."""
        param = {cls._pkey_name: obj_id}
        obj = cls._model_class.get(user_id=user_id, **param)
        if obj:
            return cls(obj)
        raise NotFound('%s #%s not found for user %s' %
                       (cls.__class__.name, obj_id, user_id))

    @classmethod
    def find(cls, user, filters=None, limit=None, offset=0, count=False):
        """
        Find core objects that belong to an user.

        can only use columns part of primary key
        """
        q = cls._model_class.filter(user_id=user.user_id)
        if not filters:
            objs = q
        else:
            objs = q.filter(**filters)
        if count:
            return objs.count()
        if limit or offset:
            objs = objs[offset:(limit + offset)]

        return {'objects': [cls(x) for x in objs], 'total': len(q)}

    @classmethod
    def count(cls, user, filters=None):
        """Count core objects that belong to an user."""
        return cls.find(user, filters, count=True)

    @classmethod
    def create(cls, user, **attrs):
        """Create a core object belong to an user."""
        obj = cls._model_class.create(user_id=user.user_id, **attrs)
        return cls(obj)

    @classmethod
    def belongs_to_user(cls, user_id, object_id):
        """Test if an object belong to an user."""
        param = {cls._pkey_name: object_id}
        obj = cls._model_class.get(user_id=user_id, **param)
        if obj:
            return True
        return False
