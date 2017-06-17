import logging

from cornice.resource import resource, view

from caliopen_main.discussion.core.discussion import (MainView,
                                                      Discussion as UserDiscussion,
                                                      build_discussion)
from ..base import Api
from caliopen_main.discussion.store.discussion_index import \
    DiscussionIndexManager as DIM
from caliopen_storage.exception import NotFound
from ..base.exception import ResourceNotFound

log = logging.getLogger(__name__)


@resource(collection_path='/discussions',
          path='/discussions/{discussion_id}')
class Discussion(Api):
    def __init__(self, request):
        self.request = request
        self.user = request.authenticated_userid

    @view(renderer='json', permission='authenticated')
    def collection_get(self):
        pi_range = self.request.authenticated_userid.pi_range
        view = MainView()
        result = view.get(self.user, pi_range[0], pi_range[1],
                          limit=self.get_limit(),
                          offset=self.get_offset())

        return {'discussions': result['discussions'],
                'total': result['total']}

    @view(renderer='json', permission='authenticated')
    def get(self):
        discussion_id = self.request.swagger_data['discussion_id']
        try:
            discussion = UserDiscussion.get(self.user, discussion_id)
        except NotFound:
            raise ResourceNotFound('No such discussion %r' % discussion_id)

        dim = DIM(self.user.id)

        indexed_discussion = dim.get_by_id(discussion_id)
        if indexed_discussion:
            resp = build_discussion(discussion, indexed_discussion)
        else:
            raise ResourceNotFound(
                'Discussion {} not found in index'.format(discussion_id))

        return resp
