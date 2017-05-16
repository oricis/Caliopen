# -*- coding: utf-8 -*-
"""Caliopen base classes for parsing logic."""
from __future__ import absolute_import, print_function, unicode_literals


class BaseRawParser(object):
    """Base class for a raw message parser."""

    message_type = None

    def __init__(self, raw):
        """Create a new instance of a raw message to be parsed."""
        self.raw = raw

    @property
    def text(self):
        """Return text value from a raw message."""
        raise NotImplementedError

    def lookup_sequence(self):
        """Output a list of lookup action to perform depending on content."""
        raise NotImplementedError

    def parse(self):
        """Return a ``NewMessage`` parameter filled with parsed info."""
        raise NotImplementedError

    def _get_participants(self):
        """Get list of ``Participant`` in a message."""
        raise NotImplementedError

    def _get_parts(self):
        """Get list of ``Part`` in a message."""
        raise NotImplementedError

    def _get_privacy_features(self):
        """Get available privacy features from a message."""
        raise NotImplementedError
