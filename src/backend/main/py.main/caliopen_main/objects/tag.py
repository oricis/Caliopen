# -*- coding: utf-8 -*-
"""Caliopen User tag parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base
from caliopen_main.user.store.user import Tag as ModelTag

import logging
log = logging.getLogger(__name__)


class UserTag(base.ObjectUser):

    """Tag related to an user."""

    _attrs = {
        'tag_id': types.StringType,
        'name': types.StringType,
        'type': types.StringType}

    _model_class = ModelTag
    _pkey_name = 'tag_id'

    def delete_db(self):
        """Delete a tag in store."""
        self._db.delete()
        return True
