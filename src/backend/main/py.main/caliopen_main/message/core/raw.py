# -*- coding: utf-8 -*-
"""Caliopen core raw message class."""
from __future__ import absolute_import, print_function, unicode_literals

import uuid
import logging
import sys

from caliopen_storage.core import BaseUserCore, BaseCore
from caliopen_storage.exception import NotFound

from ..store import (RawMessage as ModelRaw,
                     UserRawLookup as ModelUserRawLookup)
from ..format import MailMessage

log = logging.getLogger(__name__)


class RawMessage(BaseCore):

    """
    Raw message core.

    Store in binary form any message before processing
    """

    _model_class = ModelRaw
    _pkey_name = 'raw_msg_id'

    @classmethod
    def create(cls, raw):
        """Create raw message."""
        key = uuid.uuid4()
        size = sys.getsizeof(raw)
        return super(RawMessage, cls).create(raw_msg_id=key,
                                             data=raw, size=size)

    @classmethod
    def get_for_user(cls, user_id, raw_msg_id):
        """
        Get raw message by raw_msg_id, if message belongs to user

        @param: user_id is a string
        @param: raw_msg_id is a string
        """

        if not UserRawLookup.belongs_to_user(user_id, raw_msg_id):
            return None
        try:
            return super(RawMessage, cls).get(raw_msg_id)
        except NotFound:
            return None

    def parse(self):
        """Parse raw message to get a formatted object."""
        return MailMessage(self.data)


class UserRawLookup(BaseUserCore):

    """User raw message affectation."""

    _model_class = ModelUserRawLookup
    _pkey_name = 'raw_msg_id'

