import logging

from cornice.resource import resource, view

from caliopen.base.message.core import (Thread as UserThread,
                                        ReturnThread)
from caliopen.api.base import Api
from caliopen.base.exception import NotFound
from caliopen.api.base.exception import ResourceNotFound

log = logging.getLogger(__name__)


@resource(collection_path='/threads',
          path='/threads/{thread_id}')
class Thread(Api):

    def __init__(self, request):
        self.request = request
        self.user = request.authenticated_userid

    @view(renderer='json', permission='authenticated')
    def collection_get(self):
        pi_range = self.request.authenticated_userid.pi_range
        threads = UserThread.main_view(self.user, pi_range[0], pi_range[1],
                                       limit=self.get_limit(),
                                       offset=self.get_offset())
        results = [ReturnThread.build(x).serialize()
                   for x in threads['threads']]
        return {'threads': results, 'total': threads['total']}

    @view(renderer='json', permission='authenticated')
    def get(self):
        thread_id = self.request.matchdict.get('thread_id')
        try:
            thread = UserThread.get(self.user, thread_id)
        except NotFound:
            raise ResourceNotFound('No such thread %r' % thread_id)
        return {'thread': ReturnThread.build(thread).serialize()}
