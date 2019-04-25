# -*- coding: utf-8 -*-
"""Caliopen core discussion related classes."""
from __future__ import absolute_import, print_function, unicode_literals

import logging

from caliopen_main.common.objects.base import ObjectUser

from caliopen_main.participant.core import participants_from_uris, \
    hash_participants_uri
from caliopen_main.participant.core import ParticipantHash

log = logging.getLogger(__name__)


class Discussion(ObjectUser):
    """Discussion core object."""

    def upsert_lookups_for_participants(self, participants):
        """
        Ensure that participants lookup and hash lookup tables are filled
        for these participants

        :param user:
        :param participants: a collection of parameters/Participant
        :type uris: set
        :return: Discussion
        """
        if not participants:
            raise Exception("missing mandatory property to create lookup entry")

        uris = hash_participants_uri(participants)
        hash_lookup = ParticipantHash.find(user_id=self.user.user_id,
                                           kind="uris",
                                           key=uris['hash'])
        if len(hash_lookup) > 0:
            self.participants = hash_lookup[0].components
            self.participants_hash = hash_lookup[0].value
        else:
            parts = participants_from_uris(self.user, uris['URIs'],
                                           uris['hash'])
            self.participants = parts['components']
            self.participants_hash = parts['hash']

        return self
