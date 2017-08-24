# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging

from cornice.resource import resource, view
from pyramid.httpexceptions import HTTPMovedPermanently

from ..base.context import DefaultContext
from ..base import Api

log = logging.getLogger(__name__)


@resource(collection_path='/tags',
          path='/tags/{tag_id}',
          name='Tag',
          factory=DefaultContext
          )
class TagAPI(Api):
    """Tag management API."""

    def __init__(self, request, context):
        self.request = request
        self.user = request.authenticated_userid

    @view(renderer='json', permission='authenticated')
    def collection_post(self):
        # LEGACY CODE. ROUTE MOVED TO API V2
        # """Create a new tag for an user."""
        # params = self.request.swagger_data['tag']
        # user = CoreUser.get(self.user.user_id)
        # user_tags = user.tags
        # if params['name'] in [x.name for x in user_tags]:
        #     raise HTTPConflict('Tag {} already exit'.format(params['name']))
        # tag = CoreTag.create(self.user, name=params['name'], type='user')
        # tag_url = self.request.route_path('Tag', tag_id=tag.tag_id)
        # self.request.response.location = tag_url.encode('utf-8')
        # # XXX return a Location to get tag not send it direct
        # return {'location': tag_url}
        raise HTTPMovedPermanently(location="/V2/tags")

    @view(renderer='json', permission='authenticated')
    def collection_get(self):
        # LEGACY CODE. ROUTE MOVED TO API V2
        # """Return list of system and user tags."""
        # user = CoreUser.get(self.user.user_id)
        # user_tags = user.tags
        # tags = []
        # for tag in user_tags:
        #     tags.append({'tag_id': tag.tag_id,
        #                  'name': tag.name,
        #                  'type': tag.type})
        # return {'tags': tags, 'count': len(tags)}
        raise HTTPMovedPermanently(location="/V2/tags")

    @view(renderer='json', permission='authenticated')
    def get(self):
        # LEGACY CODE. ROUTE MOVED TO API V2
        # """Get a simgle user tag."""
        # name = self.request.swagger_data["tag_id"]
        # tag = UserTagObject(self.user.user_id, name=name)
        # tag.get_db()
        # tag.unmarshall_db()
        # return tag.marshall_json_dict()
        tag_id = self.request.swagger_data["tag_id"]
        tags_url = self.request.route_path("Tag", tag_id=tag_id)
        tags_url = tags_url.replace("/v1", "/v2")
        raise HTTPMovedPermanently(location=tags_url)

    @view(renderer='json', permission='authenticated')
    def delete(self):
        # LEGACY CODE. ROUTE MOVED TO API V2
        # """Delete an user tag."""
        # tag_id = self.request.swagger_data["tag_id"]
        # tag = UserTagObject(self.user.user_id, tag_id=tag_id)
        # try:
        #     tag.get_db()
        # except NotFound:
        #     raise HTTPNotFound()
        # except Exception as exc:
        #     log.err('Unexpected exception {} when retrivieng user tag'.
        #             format(exc))
        #     raise HTTPInternalServerError(exc)
        # tag.delete_db()
        # raise HTTPOk
        tag_id = self.request.swagger_data["tag_id"]
        tags_url = self.request.route_path("Tag", tag_id=tag_id)
        tags_url = tags_url.replace("/v1", "/v2")
        raise HTTPMovedPermanently(location=tags_url)
