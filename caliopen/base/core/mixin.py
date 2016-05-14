# -*- coding: utf-8 -*-
"""Caliop core mixin classes."""

import logging
from caliopen.base.exception import NotFound

log = logging.getLogger(__name__)


class MixinCoreRelation(object):

    """Mixin to manage relations on core object."""

    def _expand_relation(self, reltype):
        """Return collection for given relation."""
        res = self._relations[reltype].find(self.user, self)
        return res['data'] if res else []

    def _get_relation(self, reltype, id):
        """Get a specific core by in in relation."""
        rel_pkey = self._relations[reltype]._pkey_name
        result = self._relations[reltype].find(self.user,
                                               self,
                                               {rel_pkey: id})
        return result['data'][0] if result and result['data'] else None

    def _add_relation(self, reltype, param):
        """Add a new core to given relation."""
        param.validate()
        if hasattr(param, 'is_primary') and param.is_primary:
            existing = self._expand_relation(reltype)
            for obj in existing:
                if obj.is_primary:
                    obj.is_primary = False
                    obj.save()
                    # XXX don't forget to update index

        # Transform param into core object
        # XXX find a better method ?
        attrs = {k: v for k, v in param.to_primitive().iteritems()
                 if v is not None}
        new_obj = self._relations[reltype].create(self.user,
                                                  self,
                                                  **attrs)
        rel_list = getattr(self, reltype)
        rel_list.append(new_obj.get_id())
        self.save()
        # if self._index_class:
        #    self._add_relation_index(reltype, attrs)
        if hasattr(self, '_lookup_objects') and \
           reltype in self._lookup_objects:
            lookupkls = self._lookup_class
            look = lookupkls.create(user_id=self.user.user_id,
                                    value=new_obj.get_id(),
                                    contact_id=self.contact_id,
                                    type=reltype,
                                    lookup_id=new_obj.get_id())
            log.debug('Created lookup object for relation %s:%r' %
                      (reltype, look))

        return new_obj

    def _delete_relation(self, reltype, id):
        """Delete core from relation."""
        rel_list = getattr(self, reltype)
        if id in rel_list:
            rel_list.remove(id)
        self.save()
        related = self._get_relation(reltype, id)
        # if self._index_class and related:
        #    pkey = related._pkey_name
        #    self._delete_relation_index(reltype, pkey, id)
        if related:
            related.model.delete()
        else:
            raise NotFound
        if hasattr(self, '_lookup_objects') and \
           reltype in self._lookup_objects:
            lookupkls = self._lookup_class
            lookup = lookupkls.get(self.user, id)
            if lookup:
                lookup.delete()
            else:
                log.warn('Lookup object not found when deleting relation')
        return True

    def _add_relation_index(self, reltype, attrs):
        """Add a relation to indexed object."""
        idx = self._index_class.get(self.user_id, self.get_id())
        if not idx.update_field_add(reltype, attrs):
            log.error('Fail to update index when adding relation %r' % reltype)
        idx.refresh()
        return True

    def _delete_relation_index(self, reltype, key, id):
        """Delete a relation from an indexed object."""
        idx = self._index_class.get(self.user_id, self.get_id())
        # Look for existing entry
        found = None
        if reltype in idx.to_dict():
            for attr in idx.to_dict()[reltype]:
                if attr[key] == id:
                    found = attr
        if not found:
            log.warn('Relation %s %s with id %s not found in index' %
                     (reltype, key, id))
            return True
        if not idx.update_field_delete(reltype, found):
            log.error('Fail to update index when deleting relation %r' %
                      reltype)
        idx.refresh()
        return True


class MixinCoreIndex(object):

    """Mixin for core class with a related index."""

    @classmethod
    def find_index(cls, user, filters, order=None, limit=None, offset=0):
        """Query index to get object matching query."""
        if not filters:
            results = cls._index_class.all(user.user_id,
                                           order=order,
                                           limit=limit,
                                           offset=offset)
        else:
            results = cls._index_class.filter(user.user_id, filters,
                                              order=order,
                                              limit=limit,
                                              offset=offset)
        return results

    @classmethod
    def get_index(cls, user, id):
        """Get index entry."""
        idx = cls._index_class.get(user.user_id, id)
        if idx:
            return idx.to_dict()
        raise NotFound
