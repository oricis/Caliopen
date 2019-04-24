# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import re
import uuid
from schematics.types import StringType
from .message import NewInboundMessage
from caliopen_main.user.objects.identity import UserIdentity
from caliopen_main.discussion.core.discussion import Discussion
from caliopen_main.participant.parameters import Participant
from caliopen_main.message.parameters.external_references import \
    ExternalReferences
from caliopen_storage.exception import NotFound
from caliopen_main.message.store import Message as ModelMessage

from caliopen_main.common.errors import PatchUnprocessable

import logging

log = logging.getLogger(__name__)


class Draft(NewInboundMessage):
    body = StringType()

    def validate_uuid(self, user_id):
        if not self.message_id or not isinstance(self.message_id, uuid.UUID):
            raise PatchUnprocessable(
                message="missing or invalid message_id")
        try:
            ModelMessage.get(user_id=user_id,
                             message_id=self.message_id)
            raise PatchUnprocessable(message="message_id not unique")
        except NotFound:
            pass

    def validate_consistency(self, user, is_new):
        """
        Function used by create_draft and patch_draft
        to unsure provided params are consistent with draft's context

        :param user : the user object
        :param is_new : if true indicates that we want to validate a new draft,
                                    otherwise it is an update of existing one

        If needed, draft is modified to conform.
        """
        try:
            self.validate()

        except Exception as exc:
            log.exception("draft validation failed with error {}".format(exc))
            raise exc
        # copy body to body_plain TODO : manage plain or html switch user pref
        if hasattr(self, "body") and self.body is not None:
            self.body_plain = self.body
        else:
            self.body = self.body_plain = ""

        # fill <from> field consistently
        # based on current user's selected identity
        from_participant = self._add_from_participant(user)

        if self.parent_id:  # it is a reply, enforce participants
            self._build_participants_for_reply(user, from_participant)
            self._update_external_references(user)
        elif self.discussion_id != self.hash_participants:
            # participants_hash has changed, update lookups
            Discussion.upsert_lookups_for_participants(user, self.participants)
            self.discussion_id = self.hash_participants

        return self.discussion_id

    def _add_from_participant(self, user):

        if 'user_identities' not in self:
            raise PatchUnprocessable('Missing user identities')

        if len(self['user_identities']) != 1:
            raise PatchUnprocessable('Invalid user identities')

        user_identity = UserIdentity(user,
                                     identity_id=str(
                                         self['user_identities'][0]))
        try:
            user_identity.get_db()
            user_identity.unmarshall_db()
        except NotFound:
            raise PatchUnprocessable(message="identity not found")

        # add 'from' participant with local identity's identifier
        if not hasattr(self, 'participants'):
            self.participants = []
        else:
            if len(self.participants) > 0:
                for i, participant in enumerate(self.participants):
                    if re.match("from", participant['type'], re.IGNORECASE):
                        self.participants.pop(i)

        from_participant = Participant()
        from_participant.address = user_identity.identifier
        from_participant.label = user_identity.display_name
        from_participant.protocol = user_identity.protocol
        from_participant.type = "From"
        from_participant.contact_ids = [user.contact.contact_id]
        self.participants.append(from_participant)

        # set message's protocol to sender's one
        if from_participant.protocol in ['email', 'smtp', 'imap']:
            self.protocol = 'email'
        else:
            self.protocol = from_participant.protocol

        return from_participant

    def _build_participants_for_reply(self, user, sender):
        """
        Build participants list from message in-reply to.

        - former 'From' recipients are replaced by 'To' recipients
        - provided identity is used to fill the new 'From' participant
        - new sender is removed from former recipients

        :param sender: participant previously computed by _add_from_participant
        """
        if not self.parent_id:
            return

        parent_message = ModelMessage.get(user_id=user.user_id,
                                          message_id=self.parent_id)
        for i, participant in enumerate(parent_message["participants"]):
            if re.match("from", participant['type'], re.IGNORECASE):
                participant["type"] = "To"
                self.participants.append(participant)
            elif not re.match("list-id", participant['type'], re.IGNORECASE):
                self.participants.append(participant)

        # add sender
        # and remove it from previous recipients
        for i, participant in enumerate(self.participants):
            if participant['address'] == sender.address:
                if re.match("to", participant['type'], re.IGNORECASE) or \
                        re.match("cc", participant['type'], re.IGNORECASE) or \
                        re.match("bcc", participant['type'], re.IGNORECASE):
                    self.participants.pop(i)

    def _update_external_references(self, user):
        """
        copy externals references from current draft's ancestor
        and change parent_id to reflect new message's hierarchy
        :return:
        """
        from caliopen_main.message.objects.message import Message
        parent_msg = Message(user, message_id=self.parent_id)
        parent_msg.get_db()
        parent_msg.unmarshall_db()
        if parent_msg:
            self.external_references = ExternalReferences(
                vars(parent_msg.external_references))
            self.external_references.ancestors_ids.append(
                parent_msg.external_references.message_id)
            self.external_references.parent_id = parent_msg.external_references.message_id
            self.external_references.message_id = ""  # will be set by broker when sending
