import zope.interface

import types
from uuid import UUID
import datetime
import pytz

from caliopen_storage.exception import NotFound
import caliopen_main.errors as main_errors
from caliopen_main.interfaces import (IO, storage)
from elasticsearch import exceptions as ESexceptions

import logging
log = logging.getLogger(__name__)


class CaliopenObject(object):
    """empty class to identify Caliopen objects/types

    all custom classes should inherite from that
    """
    _attrs = {}

    def __init__(self, **kwargs):

        # TODO: type check and kwargs consistency check
        for k, v in kwargs.items():
            if k in self._attrs:
                setattr(self, k, v)

        for attr, attrtype in self._attrs.items():
            if not hasattr(self, attr):
                if type(attrtype) == types.ListType:
                    setattr(self, attr, [])
                elif type(attrtype) == types.DictType:
                    setattr(self, attr, {})
                else:
                    setattr(self, attr, None)

    def keys(self):
        """returns a list of current attributes"""

        return [k for k in self.__dict__ if not k.startswith("_")]
    def update_with(self, sibling):
        """update self attributes with those from sibling


        returns a list of first level attributes that have been modified
        """
        pass


class ObjectDictifiable(CaliopenObject):
    """Object that can marshall/unmarshall to/from python dict"""
    zope.interface.implements(IO.DictIO)

    def marshall_dict(self, **options):
        """output a dict representation of self 'public' attributes"""

        self_dict = {}
        for att, val in vars(self).items():
            if not att.startswith("_"):
                if type(self._attrs[att]) is types.ListType:
                    lst = []
                    if issubclass(self._attrs[att][0], ObjectDictifiable):
                        for item in val:
                            lst.append(item.marshall_dict())
                    else:
                        lst = val
                    self_dict[att] = lst
                else:
                    self_dict[att] = val

        return self_dict

    def unmarshall_dict(self, document, **options):
        """squash self.attrs with dict input document

        all self.attrs are reset if not in document
        """

        for attr, attrtype in self._attrs.items():
            if attr in document:
                if type(attrtype) is types.ListType:
                    lst = []
                    if issubclass(attrtype[0], ObjectDictifiable):
                        for item in document[attr]:
                            sub_obj = attrtype[0]()
                            sub_obj.unmarshall_dict(item)
                            lst.append(sub_obj)
                    else:
                        lst = document[attr]
                    setattr(self, attr, lst)
                elif issubclass(attrtype, UUID):
                    setattr(self, attr, UUID(str(document[attr])))
                elif issubclass(attrtype, datetime.datetime):
                    if document[attr] is not None \
                            and document[attr].tzinfo is None:
                        setattr(self, attr, document[attr].replace(tzinfo=
                                                                   pytz.utc))
                    else:
                        setattr(self, attr, document[attr])
                else:
                    setattr(self, attr, document[attr])
            else:
                if type(attrtype) is types.ListType:
                    setattr(self, attr, [])
                elif type(attrtype) is types.DictType:
                    setattr(self, attr, {})
                else:
                    setattr(self, attr, None)


class ObjectJsonDictifiable(ObjectDictifiable):
    """Object can marshall/unmarshall to/from python json compatible dict

    A json compatible dict is a dict with only 4 value types :
                                                                str
                                                                num
                                                                bool
                                                                None
    We rely on schematics to do the job from our object's 'public' attributes
    """

    zope.interface.implements(IO.JsonDictIO)

    _json_model = None

    def marshall_json_dict(self, **options):
        d = self.marshall_dict()
        return self._json_model(d).serialize()

    def unmarshall_json_dict(self, document, **options):
        """ TODO: handle conversion of basic json type into obj. types"""
        self.unmarshall_dict(document, **options)


class ObjectStorable(ObjectJsonDictifiable):

    zope.interface.implements(storage.DbIO)

    _model_class = None  # cql model for object
    _db = None  # cql model instance
    _pkey_name = None  # name of primary key in cassandra
    _relations = None  # related tables into cassandra
    _lookup_class = None  #
    _lookup_values = None  # tables keys, values for lookups

    def get_db(self, **options):
        """Get a core object from database and put it in self._db attribute"""

        param = {
            self._pkey_name: getattr(self, self._pkey_name)
        }
        self._db = self._model_class.get(**param)
        if self._db is None:
            raise NotFound('%s #%s not found.' %
                    (self.__class__.__name__, getattr(self, self._pkey_name)))

    def save_db(self, **options):
        raise NotImplementedError

    def create_db(self, **options):
        raise NotImplementedError

    def delete_db(self, **options):
        raise NotImplementedError

    def update_db(self, **options):
        """push updated model into db"""

        try:
            self._db.update()
        except Exception as exc:
            log.info(exc)
            return exc

        return None

    def marshall_db(self, **options):
        """squash self._db with self 'public' attributes

        self._db being a cqlengine Model, we can (re)set attributes one
        by one, cqlengine will do the job of changes logging to later make a
        smart update into the db
        """

        if not isinstance(self._db, self._model_class):
            self._db = self._model_class()

        self_keys = self._attrs.keys()
        for att in self._db.keys():
            if not att.startswith("_") and att in self_keys:
                # TODO : manage protected attrs (ie attributes that user should not be able to change directly)
                if type(self._attrs[att]) is types.ListType:
                    # TODO : manage change within list to only elem changed
                    # (use builtin set() collection ?)
                    if issubclass(self._attrs[att][0], CaliopenObject):
                        setattr(self._db, att,
                                [self._attrs[att][0]._model_class(**x.marshall_dict())
                                                for x in getattr(self, att)])
                    else:
                        setattr(self._db, att, getattr(self, att))
                else:
                    if issubclass(self._attrs[att], datetime.datetime) and \
                                    getattr(self, att) is not None:
                        # datetime in cqlengine are 'naive', ours are 'aware'
                        setattr(self._db, att,
                                getattr(self, att).replace(tzinfo=None))
                    else:
                        setattr(self._db, att, getattr(self, att))

    def unmarshall_db(self, **options):
        """squash self.attrs with db representation"""

        if isinstance(self._db, self._model_class):
            self.unmarshall_dict(dict(self._db))



class ObjectUser(ObjectStorable):
    """Objects that MUST belong to a user to survive in Caliopen's world..."""

    user_id = None

    def __init__(self, user_id=None, **params):
        if user_id is None:
            raise main_errors.ObjectInitFailed(
                message="ObjectUser must be initialized with an user_id")
        self.user_id = user_id
        super(ObjectUser, self).__init__(**params)

    def get_db(self, **options):
        """Get an object belonging to an user and put it in self._db attrs"""

        param = {
            self._pkey_name: getattr(self, self._pkey_name)
        }
        self._db = self._model_class.get(user_id=self.user_id, **param)
        if self._db is None:
            raise NotFound('%s #%s not found for user %s' %
                           (self.__class__.__name__,
                            param[self._pkey_name], self.user_id))

    def apply_patch(self, patch, options):
        """
        update self attributes with patch rfc7396 and Caliopen's specifications
        if, and only if, patch is consistent with current obj db instance

        :param patch: json-dict object describing the patch to apply
                with a "current_state" key. see caliopen rfc for explanation
        :param options: whether patch should be propagated to db and/or index
        :return: Exception or None
        """
        if patch is None or "current_state" not in patch:
            return main_errors.PatchUnprocessable()

        # check patch and patch_current have the same keys
        patch_current = patch.pop("current_state")
        if patch.keys() != patch_current.keys():
            return main_errors.PatchUnprocessable(message=
                                                  "patch and patch.current_state are inconsistent")

        # build 3 siblings : 2 from patch and last one from db
        obj_patch_new = self.__class__(user_id=self.user_id)
        obj_patch_old = self.__class__(user_id=self.user_id)
        try:
            obj_patch_new.unmarshall_json_dict(patch)
        except Exception as exc:
            log.info(exc)
            return main_errors.PatchUnprocessable(message="unable to unmarshall"
                                                          " patch into objecct")
        try:
            obj_patch_old.unmarshall_json_dict(patch_current)
        except Exception as exc:
            log.info(exc)
            return main_errors.PatchUnprocessable(message="unable to unmarshall"
                                                          " patch into object")
        try:
            self.get_db()
        except NotFound as exc:
            return exc

        # check if patch is consistent with db current state
        # if it is, squash self attributes
        self.unmarshall_db()
        for key in patch.keys():
            if type(self._attrs[key]) is types.ListType:
                if getattr(obj_patch_old, key) == [] and \
                                getattr(self, key) != []:
                    return main_errors.PatchConflict(message=
                                                     "Patch current_state not consistent with db")
                if getattr(self, key) == [] and \
                                getattr(obj_patch_old, key) != []:
                    return main_errors.PatchConflict(message=
                                                     "Patch current_state not consistent with db")
                for old in getattr(obj_patch_old, key):
                    found = False
                    for elem in getattr(self, key):
                        if issubclass(self._attrs[key][0], CaliopenObject):
                            if elem.__dict__ == old.__dict__:
                                found = True
                                break
                        else:
                            if elem == old:
                                found = True
                                break
                    if not found:
                        return main_errors.PatchConflict(message=
                                                         "Patch current_state not consistent with db")
            elif type(self._attrs[key]) is types.DictType:
                if cmp(getattr(obj_patch_old, key), getattr(self, key)) != 0:
                    return main_errors.PatchConflict(message=
                                                     "Patch current_state not consistent with db")
            else:
                if getattr(obj_patch_old, key) != getattr(self, key):
                    return main_errors.PatchConflict(message=
                                                     "Patch current_state not consistent with db")

            setattr(self, key, getattr(obj_patch_new, key))

        if "db" in options and options["db"] is True:
            # apply changes to db model and update db
            self.marshall_db()
            try:
                self.update_db()
            except Exception as exc:
                log.info(exc)
                return main_errors.PatchError(message="Error when updating db")

        return None


class ObjectIndexable(ObjectUser):

    zope.interface.implements(storage.IndexIO)

    _index_class = None  # dsl model for object
    _index = None  # dsl model instance

    def get_index(self, **options):
        """Get a doc from ES within user's index and put it at self._index"""

        obj_id = getattr(self, self._pkey_name)
        try:
            self._index = self._index_class.get(index=self.user_id,
                                                id=obj_id, using=self._index_class.client())
        except Exception as exc:
            if isinstance(exc, ESexceptions.NotFoundError):
                log.info("indexed doc not found")
                self._index = None
                raise NotFound('%s #%s not found for user %s' %
                               (self.__class__.__name__, obj_id, self.user_id))
            else:
                raise exc

    def save_index(self, **options):
        self._index.save(using=self._index_class.client())

    def create_index(self, **options):
        """Create indexed document from current self._index state"""

        self.marshall_index()
        self.save_index()

    def delete_index(self, **options):
        raise NotImplementedError

    def update_index(self, **options):
        """get indexed doc from elastic and update it with self attrs

        if indexed doc doesn't exist, create it
        else update changed fields only
        """
        self.get_index()
        if self._index is not None:
            update_dict = self.marshall_index(update=True)
            self._index.update(using=self._index_class.client(), **update_dict)
        else:
            # for some reasons, index doc not found... create one from scratch
            self.create_index()

    def marshall_index(self, **options):
        """squash self._index with self 'public' attributes

        options:
            update=True : only changed values will be replace in self._index
                          and a dict with changed applied will be returned
        """

        # TODO : manage protected attrs (ie attributes that user should not be able to change directly)

        update = False
        if "update" in options and options["update"] is True:
            update = True
            # index_sibling is instanciated with self._index values to perform
            # object comparaison
            index_sibling = self.__class__(user_id=self.user_id)
            index_sibling._index = self._index
            index_sibling.unmarshall_index()

        if not isinstance(self._index, self._index_class):
            self._index = self._index_class()
            self._index.meta.index = self.user_id
            self._index.meta.using = self._index.client()

        # update_sibling is an empty sibling that will be filled
        # with attributes from self
        update_sibling = self.__class__(user_id=self.user_id)

        m = self._index._doc_type.mapping.to_dict()
        for att in m[self._index._doc_type.name]["properties"]:
            if not att.startswith("_") and att in index_sibling.keys():
                if update:
                    if getattr(self, att) != getattr(index_sibling, att):
                        setattr(update_sibling, att, getattr(self, att))
                else:
                    setattr(update_sibling, att, getattr(self, att))

        update_dict = update_sibling.marshall_dict()

        for k, v in update_dict.iteritems():
            if k in self._index_class.__dict__:
                # do not try to set a property directly
                if not isinstance(getattr(self._index_class, k), property):
                    setattr(self._index, k, v)
            else:
                setattr(self._index, k, v)
        if update:
            delattr(update_sibling, "user_id")
            return update_sibling.marshall_json_dict()

    def unmarshall_index(self, **options):
        """squash self.attrs with index representation"""

        if isinstance(self._index, self._index_class):
            self.unmarshall_dict(self._index.to_dict())

    def apply_patch(self, patch, **options):
        error = super(ObjectIndexable, self).apply_patch(patch, options)

        if error is not None:
            return error

        if "index" in options and options["index"] is True:
            # silently update index. Should we raise an error if it fails ?
            try:
                self.update_index()
            except Exception as exc:
                return exc