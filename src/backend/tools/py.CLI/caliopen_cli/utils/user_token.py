import logging
import redis
import json

log = logging.getLogger(__name__)


class UserToken(object):

    """Utility class to deal with user token session in cache."""

    _token_prefix = 'tokens::'

    def __init__(self, redis_host, redis_port=6379):
        self.client = redis.Redis(redis_host, redis_port)

    def parse_session(self, session):
        if '-' not in session:
            return session, None
        user_id, device_id = session.split('-')
        return user_id, device_id

    def list_user_sessions(self, user_id):
        return self.client.keys('{}{}-*'.format(self._token_prefix, user_id))

    def get_token(self, token):
        infos = self.client.get(token)
        if infos:
            return json.loads(infos)
        return {}

    def delete_token(self, token):
        return self.client.delete(token)

    def get_user_status(self, user_id):
        sessions = self.list_user_sessions(user_id)
        for session in sessions:
            token = self.get_token(session)
            log.info('User session {} status is {}'.
                     format(session, token.get('user_status')))

    def _set_user_status(self, user_id, status):
        sessions = self.list_user_sessions(user_id)
        for session in sessions:
            token = self.get_token(session)
            if token.get('user_status') != status:
                log.info('Updating user session {} status '.format(session))
                token['user_status'] = status
                self.client.set(session, json.dumps(token))
        return True

    def user_set_maintenance(self, user_id):
        return self._set_user_status(user_id, 'maintenance')

    def user_unset_maintenance(self, user_id):
        return self._set_user_status(user_id, 'active')
