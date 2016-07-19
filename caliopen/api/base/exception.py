# -*- coding: utf-8 -*-
"""Specific API exception to be process with Specific view."""
from __future__ import absolute_import, print_function, unicode_literals


class ValidationError(Exception):

    """All valiation errors."""

    pass


class AuthenticationError(Exception):

    """Any authentication error."""

    pass


class AuthorizationError(Exception):

    """Any authorization error."""

    pass


class ResourceNotFound(Exception):

    """Raised when resource is not found."""

    pass
