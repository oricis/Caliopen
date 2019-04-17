import logging

from cornice.resource import resource, view

from ..base import Api
from caliopen_main.participant.core import hash_participants_uri
from caliopen_main.participant.objects import Participant

log = logging.getLogger(__name__)


@resource(collection_path='/participants/discussion',
          path='/participants/discussion')
class ParticipantDiscussion(Api):
    """
    returns canonical hash of participant_uris
    which is the corresponding discussion_id
    """

    def __init__(self, request):
        self.request = request
        self.user = request.authenticated_userid

    @view(renderer='json', permission='authenticated')
    def collection_post(self):
        parts = self.request.swagger_data['participants']
        participants = []
        for part in parts:
            participant = Participant()
            participant.address = part['address']
            participant.label = part['label']
            participant.protocol = part['protocol']
            participant.contact_id = part.get('contact_ids', [])
            participants.append(participant)
        uris = hash_participants_uri(participants)
        return {'hash': uris['hash'],
                'discussion_id': uris['hash']}
