# -*- coding: utf-8 -*-
"""Caliopen cassandra models related to user."""

from __future__ import absolute_import, print_function, unicode_literals


class NotFound(Exception):

    """Exception when object is not found in store."""

    pass


class CredentialException(Exception):

    """
    A specialized Exception, raised during an authentication attempt if an
    error occurs.
    This can be that no user was found, OR that password do mismatch.
    """

    pass
