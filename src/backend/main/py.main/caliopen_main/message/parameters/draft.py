# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import re
import uuid
from schematics.types import StringType
from .message import NewInboundMessage
from caliopen_main.user.objects.identity import UserIdentity
from caliopen_main.message.parameters.participant import Participant
from caliopen_main.message.parameters.external_references import \
    ExternalReferences
from caliopen_storage.exception import NotFound
from caliopen_main.discussion.store.discussion_index import \
    DiscussionIndexManager as DIM
from caliopen_main.message.store import Message as ModelMessage
from caliopen_main.discussion.core import Discussion
from caliopen_main.common import errors as err

import logging

log = logging.getLogger(__name__)


class Draft(NewInboundMessage):
    body = StringType()

    def validate_uuid(self, user_id):
        if not self.message_id or not isinstance(self.message_id, uuid.UUID):
            raise err.PatchUnprocessable(
                message="missing or invalid message_id")
        try:
            ModelMessage.get(user_id=user_id,
                             message_id=self.message_id)
            raise err.PatchUnprocessable(message="message_id not unique")
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
            log.warn("draft validation failed with error {}".format(exc))
            raise exc
        # copy body to body_plain TODO : manage plain or html depending on user pref.
        if hasattr(self, "body") and self.body is not None:
            self.body_plain = self.body
        else:
            self.body = self.body_plain = ""
        # check discussion consistency and get last message from discussion
        last_message = self._check_discussion_consistency(user)
        if last_message is not None:
            # check subject consistency
            # (https://www.wikiwand.com/en/List_of_email_subject_abbreviations)
            # for now, we use standard prefix «Re: » (RFC5322#section-3.6.5)
            p = re.compile(
                '([\[\(] *)?(RE?S?|FYI|RIF|I|FS|VB|RV|ENC|ODP|PD|YNT|ILT|SV|VS|VL|AW|WG|ΑΠ|ΣΧΕΤ|ΠΡΘ|תגובה|הועבר|主题|转发|FWD?) *([-:;)\]][ :;\])-]*|$)|\]+ *$',
                re.IGNORECASE)
            if hasattr(self, 'subject') and self.subject is not None:
                if p.sub('', self.subject).strip() != p.sub('',
                                                            last_message.subject).strip():
                    raise err.PatchConflict(message="subject has been changed")
            else:
                # no subject property provided :
                # add subject from context with only one "Re: " prefix
                self.subject = "Re: " + p.sub('', last_message.subject).strip()

                # TODO: prevent modification of protected attributes
                # below attributes should not be editable by patch:
                # - tags
        else:
            # fill <from> field consistently
            # based on current user's selected identity
            self._add_from_participant(user)

    def _add_from_participant(self, user):

        if 'user_identities' not in self:
            raise err.PatchUnprocessable

        if len(self['user_identities']) != 1:
            raise err.PatchUnprocessable

        user_identity = UserIdentity(user,
                                     identity_id=str(self['user_identities'][0]))
        try:
            user_identity.get_db()
            user_identity.unmarshall_db()
        except NotFound:
            raise err.PatchUnprocessable(message="identity not found")

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
        self.protocol = from_participant.protocol

        return from_participant

    def _check_discussion_consistency(self, user):
        from caliopen_main.message.objects.message import Message
        new_discussion = False
        if not hasattr(self, 'discussion_id') or self.discussion_id == "" \
                or self.discussion_id is None:
            # no discussion_id provided. Try to find one with draft's parent_id
            # or create new discussion
            if hasattr(self, 'parent_id') \
                    and self.parent_id is not None \
                    and self.parent_id != "":
                parent_msg = Message(user, message_id=self.parent_id)
                try:
                    parent_msg.get_db()
                    parent_msg.unmarshall_db()
                except NotFound:
                    raise err.PatchError(message="parent message not found")
                self.discussion_id = parent_msg.discussion_id
            else:
                discussion = Discussion.create_from_message(user, self)
                self.discussion_id = discussion.discussion_id
                new_discussion = True
        if not new_discussion:
            dim = DIM(user)
            d_id = self.discussion_id
            last_message = dim.get_last_message(d_id, -10, 10, True)
            if last_message == {}:
                raise err.PatchError(
                    message='No such discussion {}'.format(d_id))
            is_a_reply = (str(last_message.message_id) != str(self.message_id))
            if is_a_reply:
                # check participants consistency
                if hasattr(self, "participants") and len(self.participants) > 0:
                    participants = [p['address'] for p in self.participants]
                    last_msg_participants = [p['address'] for p in
                                             last_message.participants]
                    if len(participants) != len(last_msg_participants):
                        raise err.PatchError(
                            message="list of participants "
                                    "is not consistent for this discussion")
                    participants.sort()
                    last_msg_participants.sort()

                    for i, participant in enumerate(participants):
                        if participant != last_msg_participants[i]:
                            raise err.PatchConflict(
                                message="list of participants "
                                        "is not consistent for this discussion")
                else:
                    self.build_participants_for_reply(user)

                # check parent_id consistency
                if 'parent_id' in self and self.parent_id != "" \
                        and self.parent_id is not None:
                    if not dim.message_belongs_to(
                            discussion_id=self.discussion_id,
                            message_id=self.parent_id):
                        raise err.PatchConflict(message="provided message "
                                                        "parent_id does not belong "
                                                        "to this discussion")
                else:
                    self.parent_id = last_message.parent_id

                self.update_external_references(user)

            else:
                last_message = None
        else:
            last_message = None

        return last_message

    def build_participants_for_reply(self, user):
        """
        build participants list from last message in discussion.
        - former 'From' recipients are replaced by 'To' recipients
        - provided identity is used to fill the new 'From' participant
        - new sender is removed from former recipients
        """
        dim = DIM(user)
        d_id = self.discussion_id
        last_message = dim.get_last_message(d_id, -10, 10, False)
        for i, participant in enumerate(last_message["participants"]):
            if re.match("from", participant['type'], re.IGNORECASE):
                participant["type"] = "To"
                self.participants.append(participant)
            else:
                self.participants.append(participant)

        # add sender
        # and remove it from previous recipients
        sender = self._add_from_participant(user)
        for i, participant in enumerate(self.participants):
            if participant['address'] == sender.address:
                if re.match("to", participant['type'], re.IGNORECASE) or \
                        re.match("cc", participant['type'], re.IGNORECASE) or \
                        re.match("bcc", participant['type'], re.IGNORECASE):
                    self.participants.pop(i)

    def update_external_references(self, user):
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
            self.external_references.message_id = ""  # will be set by broker at sending time
