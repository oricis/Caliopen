# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging

import elasticsearch_dsl as dsl

log = logging.getLogger(__name__)


class IndexedParticipant(dsl.InnerObjectWrapper):

    """Nest participant indexed model."""

    address = dsl.String()
    contact_id = dsl.String()
    label = dsl.String()
    protocol = dsl.String()
    type = dsl.String()
