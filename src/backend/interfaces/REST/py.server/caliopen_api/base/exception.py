# -*- coding: utf-8 -*-
"""Specific API exception to be process with Specific view."""
from __future__ import absolute_import, print_function, unicode_literals
from pyramid.httpexceptions import HTTPClientError
from caliopen_storage.exception import NotFound
from caliopen_main.common.errors import (PatchUnprocessable, PatchError,
                                         PatchConflict)

import logging

log = logging.getLogger(__name__)


class ValidationError(HTTPClientError):
    """
    subclass of :class:`~HTTPClientError`

    This indicates that the body or headers failed validity checks,
    preventing the server from being able to continue processing.

    code: 400, title: Bad Request
    """
    code = 400
    title = 'Bad Request'
    explanation = ('The server could not comply with the request since '
                   'it is either malformed or otherwise incorrect.')


class AuthenticationError(HTTPClientError):
    """
    subclass of :class:`~HTTPClientError`

    This indicates that the user authentication failed.

    code: 401, title: Unauthorized
    """
    code = 401
    title = 'Authentication error'
    explanation = 'Wrong credentials (e.g., bad password or username)'


class NotAcceptable(HTTPClientError):
    code = 406
    title = 'Not acceptable'
    explanation = 'Server cannot fulfill the request with given payload'


class ResourceNotFound(HTTPClientError):
    code = 404
    title = 'Not Found'
    explanation = 'The resource could not be found.'


class MethodNotAllowed(HTTPClientError):
    code = 405
    title = 'Method not allowed'
    explanation = 'The method is not allowed or not yet implemented'


class MergePatchError(HTTPClientError):
    def __init__(self, error=None):
        self.message = error.message
        if isinstance(error, NotFound):
            self.code = 404
            self.title = "Not Found"
            self.explanation = "The resource could not be found to apply PATCH"
        elif isinstance(error, PatchUnprocessable):
            self.code = 422
            self.title = "Patch Unprocessable"
            self.explanation = "PATCH payload was malformed or unprocessable"
        elif isinstance(error, PatchError):
            self.code = 422
            self.title = "Patch Error"
            self.explanation = "Application encountered an error when " \
                               "applying patch"
        elif isinstance(error, PatchConflict):
            self.code = 409
            self.title = "Patch Conflict"
            self.explanation = "The request cannot be applied given " \
                               "the state of the resource"


class Unprocessable(HTTPClientError):
    """
    subclass of :class:`~HTTPClientError`

    This indicates that the body or headers failed validity checks,
    preventing the server from being able to continue processing.

    code: 422, title: Bad Request
    """
    code = 422
    title = 'Unprocessable entity'
    explanation = 'The method is not allowed or not yet implemented'
