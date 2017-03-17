# -*- coding: utf-8 -*-
"""Caliopen index classes for nested tag."""
from __future__ import absolute_import, print_function, unicode_literals

import logging

import elasticsearch_dsl as dsl

log = logging.getLogger(__name__)


class IndexedPrivacyFeatures(dsl.InnerObjectWrapper):

    """privacy features indexed model."""

