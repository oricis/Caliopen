# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from caliopen_main.message.parameters import (NewInboundMessage,
                                              Participant,
                                              Attachment)
from caliopen_main.message.parsers.twitter import TwitterDM
from caliopen_main.discussion.core import Discussion
from caliopen_storage.config import Configuration

from ..features.types import unmarshall_features

log = logging.getLogger(__name__)


class UserDMQualifier(object):
    """
    Process a Twitter direct message to unmarshal it in our stack
    """

    def __init__(self, user):
        self.user = user

    def _get_tags(self, message):
        """Evaluate user rules to get all tags for a mail."""
        tags = []
        if message.privacy_features.get('is_internal', False):
            # XXX do not hardcode the wanted tag
            internal_tag = [x for x in self.user.tags if x.name == 'internal']
            if internal_tag:
                tags.append(internal_tag[0].name)
        message.tags = tags

    def get_participant(self, participant):
        """TODO: find related contact"""
        p = Participant()
        p.address = participant.address
        p.type = participant.type
        p.label = participant.label
        p.protocol = "twitter"
        return p

    def process_inbound(self, raw):
        """Process inbound message.

        @param raw: a RawMessage object
            which should be a json conforming to
            https://developer.twitter.com/en/docs/direct-messages/\
            sending-and-receiving/guides/message-create-object
        @rtype: NewMessage
        """

        message = TwitterDM(raw.raw_data)
        new_message = NewInboundMessage()
        new_message.raw_msg_id = raw.raw_msg_id
        new_message.body_plain = message.body_plain
        new_message.date = message.date
        new_message.type = message.type
        new_message.is_unread = True
        new_message.is_draft = False
        new_message.is_answered = False
        new_message.is_received = True
        new_message.importance_level = 0  # XXX tofix on parser

        participants = []
        for p in message.participants:
            participant = self.get_participant(p)
            new_message.participants.append(participant)
            participants.append(participant)
        if not participants:
            raise Exception("no participant found in raw message {}".format(
                raw.raw_msg_id))

        # Compute PI !!
        # TODO

        # compute tags
        self._get_tags(new_message)
        if new_message.tags:
            log.debug('Resolved tags {}'.format(new_message.tags))

        # lookup by external references
        # TODO
        # for now a new discussion is created each time

        discussion = Discussion.create_from_message(self.user, message)
        log.debug('Created discussion {}'.format(discussion.discussion_id))
        new_message.discussion_id = discussion.discussion_id
        # Format features
        new_message.privacy_features = \
            unmarshall_features(new_message.privacy_features)
        try:
            new_message.validate()
        except Exception as exc:
            log.error(
                "validation failed with error : « {} » \
                for new_message {}[dump : {}]".format(
                    exc, new_message, vars(new_message)))
            raise exc

        return new_message
