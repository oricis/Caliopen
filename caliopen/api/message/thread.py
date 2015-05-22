import logging

from cornice.resource import resource

from caliopen.base.message.core import (Thread as UserThread,
                                        ReturnIndexThread)
from caliopen.api.base import Api, make_url
from caliopen.base.exception import NotFound
from caliopen.api.base.exception import ResourceNotFound

log = logging.getLogger(__name__)


@resource(collection_path=make_url('/threads'),
          path=make_url('/threads/{thread_id}'))
class Thread(Api):

    def __init__(self, request):
        self.request = request
        self.user = self.check_user()

    def collection_get(self):
        threads = UserThread.find_index(self.user,
                                        limit=self.get_limit(),
                                        offset=self.get_offset())
        results = [ReturnIndexThread.build(x).serialize()
                   for x in threads['data']]
        return {'threads': results}

    def get(self):
        thread_id = int(self.request.matchdict.get('thread_id'))
        try:
            thread = UserThread.get(self.user, thread_id)
        except NotFound:
            raise ResourceNotFound('No such thread %r' % thread_id)
        return {'thread': ReturnIndexThread.build(thread).serialize()}
