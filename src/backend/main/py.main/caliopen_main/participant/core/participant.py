# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import hashlib
import logging

log = logging.getLogger(__name__)


def hash_participants_uri(participants):
    """
    Create hash from a collection of Participant

    :param participants: a collection of Participant
    :return: sorted collection of participants' URI + hash of this collection

    hash is computed from a set of URIs which are strings modeled as
    'participant.protocol:participant.address'
    """
    URIs = set()
    for participant in participants:
        if not participant.address or not participant.protocol:
            raise Exception("missing mandatory property in participant")
        uri = participant.protocol + ":" + participant.address
        URIs.add(uri)

    URIs = list(URIs)
    URIs.sort()
    hash = hashlib.sha256(''.join(URIs)).hexdigest()
    return {'URIs': URIs, 'hash': hash}
