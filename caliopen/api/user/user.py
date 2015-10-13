# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging
import datetime

import colander
from pyramid.security import NO_PERMISSION_REQUIRED
from cornice.resource import resource, view
from caliopen.api.base.context import DefaultContext
from .util import create_token

from caliopen.base.user.core import User
from caliopen.api.base import Api
from caliopen.api.base.exception import AuthenticationError, ValidationError

from caliopen.base.user.returns import ReturnUser

log = logging.getLogger(__name__)


class UserAuthenticationParameter(colander.MappingSchema):

    """Parameter for user authentication."""

    username = colander.SchemaNode(colander.String(), location='body')
    password = colander.SchemaNode(colander.String(), location='body')


@resource(path='',
          collection_path='/authentications',
          name='Authentication',
          schema=UserAuthenticationParameter,
          factory=DefaultContext,
          )
class AuthenticationAPI(Api):

    """User authentication API."""

    @view(renderer='json', permission=NO_PERMISSION_REQUIRED)
    def collection_post(self):
        """
        Api for user authentication.

        Store generated tokens in a cache entry related to user_id
        and return a structure with this tokens for client usage.
        """
        params = self.request.validated
        try:
            user = User.authenticate(params['username'], params['password'])
            log.info('Authenticate user {username}'.format(username=user.name))
        except Exception as exc:
            log.info('Authentication error for {name} : {error}'.
                     format(name=params['username'], error=exc))
            raise AuthenticationError(exc)

        access_token = create_token()
        refresh_token = create_token(80)

        ttl = self.request.cache.client.ttl
        expires_at = (datetime.datetime.utcnow() +
                      datetime.timedelta(seconds=ttl))
        tokens = {'access_token': access_token,
                  'refresh_token': refresh_token,
                  'expires_in': ttl,  # TODO : remove this value
                  'expires_at': expires_at.isoformat()}
        self.request.cache.set(user.user_id, tokens)

        return {'user_id': user.user_id,
                'username': user.name,
                'tokens': tokens}


@resource(path='/users/{user_id}',
          name='User',
          factory=DefaultContext)
class UserAPI(Api):

    """User API."""

    @view(renderer='json', permission='authenticated')
    def get(self):
        user_id = self.request.matchdict.get('user_id')
        if user_id != self.request.authenticated_userid.user_id:
            raise AuthenticationError()
        user = User.get(user_id)
        return ReturnUser.build(user).serialize()
