# -*- coding: utf-8 -*-
"""Caliopen cassandra models related to user."""

from __future__ import absolute_import, print_function, unicode_literals


class NotFound(Exception):
    """Exception when object is not found in store."""

    pass


class CredentialException(Exception):
    """Generic exception during user authentication process."""

    pass


class DuplicateObject(Exception):
    """Exception when an existing object already exists."""

    pass
