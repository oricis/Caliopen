# -*- coding: utf-8 -*-
"""Caliopen core related classes."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from caliopen_storage.core import BaseCore

log = logging.getLogger(__name__)


class BaseUserRelatedCore(BaseCore):
    """Core class for related objects to an user and another entity."""

    _resource_name = None

    @classmethod
    def create(cls, user, resource_id, **kwargs):
        """Create a related user and resource entity."""
        kwargs.update({cls._resource_name: resource_id})
        obj = cls._model_class.create(user_id=user.user_id, **kwargs)
        return cls(obj)

    @classmethod
    def get(cls, user, resource_id, value):
        """Get a related entity."""
        kwargs = {'user_id': user.user_id,
                  cls._pkey_name: value,
                  cls._resource_name: resource_id}
        try:
            obj = cls._model_class.get(**kwargs)
            return cls(obj)
        except Exception as exc:
            log.exception('Unexpected error during retrieve of resource %s'
                          % exc)
            return None

    @classmethod
    def find(cls, user, resource_id, filters=None):
        """Find related object for an user and an given resource."""
        filters = filters if filters else {}
        filters.update({'user_id': user.user_id,
                        cls._resource_name: resource_id})
        q = cls._model_class.filter(**filters)
        if not filters:
            objs = q
        else:
            objs = q.filter(**filters)
        return {'total': len(objs), 'data': [cls(x) for x in objs]}

    def to_dict(self):
        """Return a dict representation."""
        return {col: getattr(self, col)
                for col in self._model_class._columns.keys()}
