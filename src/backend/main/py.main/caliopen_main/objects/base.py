import zope.interface

from types import *
import datetime
from uuid import UUID, uuid4

from caliopen_storage.exception import NotFound
import caliopen_main.errors as main_errors
import caliopen_main.interfaces as interface

from caliopen_main.user.store.contact import Email
from cassandra.cqlengine.models import ColumnDescriptor

import logging
log = logging.getLogger(__name__)


class CaliopenObject(object):
    """empty class to identify Caliopen objects/types

    all custom classes should inherite from that
    """
    _attrs = {}

    def __init__(self):

        # for k, v in kwargs.items():
        #     if k in self._attrs:
        #         setattr(self, k, v)

        for attr, attrtype in self._attrs.items():
            if not hasattr(self, attr):
                if type(attrtype) == ListType:
                    setattr(self, attr, [])
                elif type(attrtype) == DictType:
                    setattr(self, attr, {})
                else:
                    setattr(self, attr, None)

    def update_with(self, sibling):
        """update self attributes with those from sibling


        returns a list of first level attributes that have been modified
        """
        pass


class ObjectDictifiable(CaliopenObject):
    """Object that can marshall/unmarshall to/from python dict"""
    zope.interface.implements(interface.DictIO)

    def marshall_dict(self, **options):
        """output a dict representation of self 'public' attributes"""

        self_dict = {}
        for att, val in vars(self).items():
            if not att.startswith("_"):
                if type(self._attrs[att]) is ListType:
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
                if type(attrtype) is ListType:
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
                else:
                    setattr(self, attr, document[attr])
            else:
                if type(attrtype) is ListType:
                    setattr(self, attr, [])
                elif type(attrtype) is DictType:
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

    zope.interface.implements(interface.JsonDictIO)

    _json_model = None

    def marshall_json_dict(self, **options):
        d = self.marshall_dict()
        return self._json_model(d).serialize()

    def unmarshall_json_dict(self, document, **options):
        """TODO: handle conversion of basic json type into obj. types"""
        self.unmarshall_dict(document, **options)


class ObjectStorable(ObjectJsonDictifiable):

    zope.interface.implements(interface.DbIO)

    _model_class = None  # cql model for object
    _db = None  # cql model instance
    _pkey_name = None  # name of primary key in cassandra
    _relations = None  # related tables into cassandra
    _lookup_class = None  #
    _lookup_values = None  # tables keys, values for lookups

    def get_db(self, user_id, obj_id, **options):
        """Get a core object from database and put it in self._db attribute"""

        param = {self._pkey_name: obj_id}
        self._db = self._model_class.get(user_id=user_id, **param)
        if self._db is None:
            raise NotFound('%s #%s not found for user %s' %
                           (self.__class__.name, obj_id, user_id))

    def save_db(self, **options):
        pass

    def create_db(self, **options):
        pass

    def delete_db(self, **options):
        pass

    def update_db(self, **options):
        """push updated model into db"""

        # copy current self_db values in a sibling
        # db_state = self.__class__()
        # db_state._db = self._model_class(**self.marshall_dict())
        # db_state._db.validate()
        #
        # log.info("self : {}".format(vars(self)))
        # log.info("db_state : {}".format(vars(db_state)))
        # log.info("_db keys : {}".format(self._db.keys()))
        # self_keys = self._attrs.keys()
        # for att in self._db.keys():
        #     if not att.startswith("_") and att in self_keys:
        #         db_state_att = getattr(db_state, att)
        #         if db_state_att != getattr(self, att):
        #             # if type(self._attrs[att]) is ListType:
        #             #     dbatt = getattr(self._db, att)
        #             #     for elem in getattr(self, att):
        #             #         if elem not in db_state_att:
        #             #             dbatt.append(elem)
        #             #     for elem in db_state_att:
        #             #         if elem not in getattr(self, att):
        #             #             dbatt.remove(elem)
        #             #     setattr(self._db, att, dbatt)
        #             # else:
        #             setattr(self._db, att, getattr(self, att))
        # log.info("after self : {}".format(vars(self)))

        try:
            self._db.update()
        except Exception as exc:
            log.info(exc)
            return exc

        return None

    def marshall_db(self, **options):
        """squash self._db with self 'public' attributes"""

        self_keys = self._attrs.keys()

        for att in self._db.keys():
            if not att.startswith("_") and att in self_keys:
                if type(self._attrs[att]) is ListType:
                    # TODO : manage change within list to only elem changed
                    if issubclass(self._attrs[att][0], CaliopenObject):
                        setattr(self._db, att,
                                [self._attrs[att][0]._model_class(**x.marshall_dict())
                                                for x in getattr(self, att)])
                    else:
                        setattr(self._db, att, getattr(self, att))
                else:
                    setattr(self._db, att, getattr(self, att))

    def unmarshall_db(self, **options):
        """squash self.attrs with db representation"""

        if isinstance(self._db, self._model_class):
            self.unmarshall_dict(dict(self._db))

    def apply_patch(self, user_id, object_id, patch, **options):
        """
        update self attributes with patch rfc7396 and Caliopen's specifications
        if, and only if, patch is consistent with current obj db instance

        :param user_id: user_id as str
        :param object_id: object_id in db, as str
        :param patch: json-dict object describing the patch to apply
                with a "current_state" key. see caliopen rfc for explanation
        :return: Exception or None
        """

        if user_id is None or object_id is None or patch is None \
                or "current_state" not in patch:
            return main_errors.PatchUnprocessable()

        # check patch and patch_current have the same keys
        patch_current = patch.pop("current_state")
        if patch.keys() != patch_current.keys():
            return main_errors.PatchUnprocessable(message=
                               "patch and patch.current_state are inconsistent")

        # build 3 objects : 2 from patch and last one from db
        obj_patch_new = self.__class__()
        obj_patch_old = self.__class__()
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
            self.get_db(user_id, object_id)
        except NotFound as exc:
            return exc

        # check if patch is consistent with db current state
        # if it is, squash self attributes
        self.unmarshall_db()
        for key in patch.keys():
            if type(self._attrs[key]) is ListType:
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
            elif type(self._attrs[key]) is DictType:
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

        if "index" in options and options["index"] is True:
            # silently update index. Should we raise an error if it fails ?
            log.info("we'll update index")
            # self.marshall_index()
            # self.update_index()

        return None


class ObjectIndexable(ObjectJsonDictifiable):
    zope.interface.implements(interface.IndexIO)

    _index_class = None  # dsl model for object
    _index = None  # dsl model instance
