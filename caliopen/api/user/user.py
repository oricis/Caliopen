# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging
from datetime import datetime

from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.httpexceptions import HTTPBadRequest
from cornice.resource import resource, view
from .context import DefaultContext
from .util import create_token

from caliopen.base.user.core import User
from caliopen.api.base import Api

log = logging.getLogger(__name__)


@resource(path='',
          collection_path='/authentications',
          name='Authentication',
          factory=DefaultContext,
          )
class AuthenticationAPI(Api):

    """User authentication API."""

    def _raise(self):
        raise HTTPBadRequest(explanation='Bad username or password')

    @view(renderer='json', permission=NO_PERMISSION_REQUIRED)
    def collection_post(self):
        """
        Api for user authentication.

        Store generated tokens in a cache entry related to user_id
        and return a structure with this tokens for client usage.
        """
        params = self.request.validated
        user = User.authenticate(params['username'],
                                 params['password'])
        if not user:
            self._raise()

        log.info('Authenticate user {username}'.format(username=user.name))

        access_token = create_token()
        refresh_token = create_token(80)

        ttl = self.request.cache.client.ttl
        tokens = {'access_token': access_token,
                  'refresh_token': refresh_token,
                  'expires_in': ttl}
        self.request.cache.set(user.user_id, tokens)

        return {'user_id': user.user_id,
                'username': user.name,
                'tokens': tokens}
