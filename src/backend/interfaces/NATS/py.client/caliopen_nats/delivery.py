# -*- coding: utf-8 -*-
"""Caliopen user message delivery logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging
import uuid

import datetime
import pytz
from caliopen_storage.exception import NotFound
from caliopen_main.message.core import RawMessage
from caliopen_main.message.objects.message import Message
from caliopen_main.message.store.message import \
    MessageExternalRefLookup
from caliopen_pi.qualifiers import UserMessageQualifier, UserDMQualifier

log = logging.getLogger(__name__)


class UserMessageDelivery(object):
    """User message delivery processing."""

    def __init__(self, user, identity):
        """Create a new UserMessageDelivery belong to an user."""
        self.user = user
        self.identity = identity

    def process_raw(self, raw_msg_id):
        """Process a raw message for an user, ie makes it a rich 'message'."""
        raw = RawMessage.get(raw_msg_id)
        if not raw:
            log.error('Raw message <{}> not found'.format(raw_msg_id))
            raise NotFound
        log.debug('Retrieved raw message {}'.format(raw_msg_id))

        qualifier = UserMessageQualifier(self.user, self.identity)
        message = qualifier.process_inbound(raw)

        # store and index message
        obj = Message(user=self.user)
        obj.unmarshall_dict(message.to_native())
        obj.user_id = uuid.UUID(self.user.user_id)
        obj.user_identities = [uuid.UUID(self.identity.identity_id)]
        obj.message_id = uuid.uuid4()
        obj.date_insert = datetime.datetime.now(tz=pytz.utc)
        obj.date_sort = obj.date_insert
        obj.marshall_db()
        obj.save_db()
        obj.marshall_index()
        obj.save_index()

        # store external_msg_id in lookup table
        # but do not abort if it failed
        try:
            MessageExternalRefLookup.create(self.user,
                                            external_msg_id=obj.external_msg_id,
                                            identity_id=obj.user_identity,
                                            message_id=obj.message_id)
        except Exception as exc:
            log.exception("UserMessageDelivery failed "
                          "to store message_external_ref : {}".format(exc))
        return obj


class UserTwitterDMDelivery(object):
    """Twitter Direct Message delivery processing"""

    def __init__(self, user, identity):
        self.user = user
        self.identity = identity

    def process_raw(self, raw_msg_id):
        raw = RawMessage.get(raw_msg_id)
        if not raw:
            log.error('Raw message <{}> not found'.format(raw_msg_id))
            raise NotFound
        log.debug('Retrieved raw message {}'.format(raw_msg_id))

        qualifier = UserDMQualifier(self.user, self.identity)
        message = qualifier.process_inbound(raw)

        # store and index message
        obj = Message(self.user)
        obj.unmarshall_dict(message.to_native())
        obj.user_id = uuid.UUID(self.user.user_id)
        obj.user_identities = [uuid.UUID(self.identity.identity_id)]
        obj.message_id = uuid.uuid4()
        obj.date_insert = datetime.datetime.now(tz=pytz.utc)
        obj.date_sort = obj.date_insert
        obj.marshall_db()
        obj.save_db()
        obj.marshall_index()
        obj.save_index()

        # store external_msg_id in lookup table
        # but do not abort if it failed
        try:
            MessageExternalRefLookup.create(self.user,
                                            external_msg_id=obj.external_msg_id,
                                            identity_id=obj.user_identity,
                                            message_id=obj.message_id)
        except Exception as exc:
            log.exception("UserTwitterDMDelivery failed "
                          "to store message_external_ref : {}".format(exc))

        return obj
