# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.common.objects.base import ObjectUser
from caliopen_main.participant.core import hash_participants_uri, \
    participants_from_uris
from caliopen_main.participant.store import ParticipantHash


class Discussion(ObjectUser):
    _attrs = {
        'uris_hash': types.StringType,
        'uris': [types.StringType],
        'participants_hash': types.StringType,
        'participants': [types.StringType],
    }

    def upsert_lookups_for_participants(self, user, participants):
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
        self.uris = uris['uris']
        self.uris_hash = uris['hash']
        hash_lookup = ParticipantHash.find(user_id=user.user_id, kind="uris",
                                           key=uris['hash'])
        if len(hash_lookup) > 0:
            self.participants = hash_lookup[0].components
            self.participants_hash = hash_lookup[0].value
        else:
            parts = participants_from_uris(user, uris['URIs'],
                                           uris['hash'])
            self.participants = parts['components']
            self.participants_hash = parts['hash']

        return self
