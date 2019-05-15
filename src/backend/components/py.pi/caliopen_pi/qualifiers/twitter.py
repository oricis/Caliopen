# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from caliopen_main.message.parameters import NewInboundMessage
from caliopen_main.message.parsers.twitter import TwitterDM
from caliopen_main.discussion.core import Discussion
from caliopen_main.participant.store import HashLookup
from caliopen_main.common.helpers.normalize import clean_twitter_address

from ..features import marshal_features
from .base import BaseQualifier

log = logging.getLogger(__name__)


class UserDMQualifier(BaseQualifier):
    """Process a Twitter direct message to unmarshal it in our stack."""

    _lookups = {
        'hash': HashLookup,
    }

    def lookup_discussion_sequence(self, message, *args, **kwargs):
        """Return list of lookup type, value from a tweet."""
        seq = list()

        participants = message.hash_participants
        seq.append(('hash', participants))

        return seq, seq[0][1]

    def process_inbound(self, raw):
        """
        Process inbound message.

        @param raw: a RawMessage object
            which should be a json conforming to
            https://developer.twitter.com/en/docs/direct-messages/\
            sending-and-receiving/guides/message-create-object
        @rtype: NewMessage
        """
        tweet = TwitterDM(raw.raw_data)
        new_message = NewInboundMessage()
        new_message.raw_msg_id = raw.raw_msg_id
        new_message.body_plain = tweet.body_plain
        new_message.date = tweet.date
        new_message.protocol = tweet.protocol
        new_message.is_unread = True
        new_message.is_draft = False
        new_message.is_answered = False
        new_message.is_received = True
        new_message.importance_level = 0  # XXX tofix on parser
        new_message.external_references = tweet.external_references

        participants = []
        for p in tweet.participants:
            p.address = clean_twitter_address(p.address)
            participant, contact = self.get_participant(tweet, p)
            new_message.participants.append(participant)
            participants.append((participant, contact))

        if not participants:
            raise Exception("no participant found in raw tweet {}".format(
                raw.raw_msg_id))

        # Compute PI !!
        # TODO

        # compute tags
        self._get_tags(new_message)
        if new_message.tags:
            log.debug('Resolved tags {}'.format(new_message.tags))

        # build discussion_id from lookup_sequence
        lookup_sequence, discussion_id = self.lookup_discussion_sequence(
            new_message)
        log.debug('Lookup with sequence {} gives {}'.format(lookup_sequence,
                                                            discussion_id))
        new_message.discussion_id = discussion_id

        # upsert lookup tables
        discuss = Discussion(self.user)
        discuss.upsert_lookups_for_participants(new_message.participants)
        # Format features
        new_message.privacy_features = \
            marshal_features(new_message.privacy_features)
        try:
            new_message.validate()
        except Exception as exc:
            log.error(
                "validation failed with error : « {} » \
                for new_message {}[dump : {}]".format(
                    exc, new_message, vars(new_message)))
            raise exc

        return new_message
