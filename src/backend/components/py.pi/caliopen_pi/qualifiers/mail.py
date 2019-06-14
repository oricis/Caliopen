# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals

import logging
from caliopen_main.message.parameters import (NewInboundMessage,
                                              Attachment)
from caliopen_main.participant.parameters.participant import Participant

from caliopen_storage.config import Configuration
from caliopen_main.participant.core import hash_participants_uri
from caliopen_main.participant.store import HashLookup

# XXX use a message formatter registry not directly mail format
from caliopen_main.message.parsers.mail import MailMessage
from caliopen_main.discussion.core import Discussion

from ..features import InboundMailFeature, marshal_features
from .base import BaseQualifier

log = logging.getLogger(__name__)


class UserMessageQualifier(BaseQualifier):
    """
    Process a message to enhance it with.

        - tags
        - pi
        - discussion reference
        - etc.

    """

    _lookups = {
        'list': HashLookup,
        'hash': HashLookup,
    }

    def lookup_discussion_sequence(self, mail, message):
        """
        Return list of lookups (type, value) from a mail message
        and the first lookup'hash from that list
        """
        seq = []

        # lists lookup first
        lists = []
        for list_id in mail.extra_parameters.get('lists', []):
            lists.append(list_id)
        if len(lists) > 0:
            # list_ids are considered `participants`
            # build uris' hash and upsert lookup tables
            participants = []
            for list_id in lists:
                participant = Participant()
                participant.address = list_id.lower()
                participant.protocol = 'email'
                participant.type = 'list-id'
                participants.append(participant)
                discuss = Discussion(self.user)
                discuss.upsert_lookups_for_participants(participants)
                # add list-id as a participant to the message
                message.participants.append(participant)
            hash = hash_participants_uri(participants)
            seq.append(('list', hash['hash']))

        # then participants
        seq.append(('hash', message.hash_participants))

        # try to link message to external thread's root message-id
        #        if len(message.external_references["ancestors_ids"]) > 0:
        #            seq.append(("thread",
        #                        message.external_references["ancestors_ids"][0]))
        #        elif message.external_references["parent_id"]:
        #            seq.append(("thread", message.external_references["parent_id"]))
        #        elif message.external_references["message_id"]:
        #            seq.append(("thread", message.external_references["message_id"]))

        return seq, seq[0][1]

    def process_inbound(self, raw):
        """Process inbound message.

        @param raw: a RawMessage object
        @rtype: NewMessage
        """
        email = MailMessage(raw.raw_data)
        new_message = NewInboundMessage()
        new_message.raw_msg_id = raw.raw_msg_id
        new_message.subject = email.subject
        new_message.body_html = email.body_html
        new_message.body_plain = email.body_plain
        new_message.date = email.date
        new_message.size = email.size
        new_message.protocol = email.message_protocol
        new_message.is_unread = True
        new_message.is_draft = False
        new_message.is_answered = False
        new_message.is_received = True
        new_message.importance_level = 0  # XXX tofix on parser
        new_message.external_references = email.external_references

        participants = []
        for p in email.participants:
            p.address = p.address.lower()
            try:
                participant, contact = self.get_participant(email, p)
                new_message.participants.append(participant)
                participants.append((participant, contact))
            except Exception as exc:
                log.error("process_inbound failed to lookup participant for email {} : {}".format(vars(email), exc))
                raise exc


        if not participants:
            raise Exception("no participant found in raw email {}".format(
                raw.raw_msg_id))

        for a in email.attachments:
            attachment = Attachment()
            attachment.content_type = a.content_type
            attachment.file_name = a.filename
            attachment.size = a.size
            attachment.mime_boundary = a.mime_boundary
            if hasattr(a, "is_inline"):
                attachment.is_inline = a.is_inline
            new_message.attachments.append(attachment)

        # Compute PI !!
        conf = Configuration('global').configuration
        extractor = InboundMailFeature(email, conf)
        extractor.process(self.user, new_message, participants)

        # compute user tags
        self._get_tags(new_message)
        # embed external flags if any
        new_message.ext_tags = email.external_flags
        if new_message.tags:
            log.debug('Resolved tags {}'.format(new_message.tags))

        # build discussion_id from lookup_sequence
        lookup_sequence, discussion_id = self.lookup_discussion_sequence(email,
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
        # TODO link raw message with current user
        # XXX create lookup
