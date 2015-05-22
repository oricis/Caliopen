from caliopen.base.user.core import User
from caliopen.base.config import Configuration
from .exception import AuthenticationError
from .config import includeme


def make_url(url):
    # XXX : should use cornice.route_prefix configuration
    BASE_URL = Configuration('global').get('api.url', '/api')
    return '%s%s' % (BASE_URL, url)


DEFAULT_LIMIT = Configuration('global').get('site.item_per_page', 20)


class Api(object):

    """Base class for all Api."""

    def __init__(self, request):
        self.request = request

    def check_user(self):
        if 'user' in self.request.session:
            return User.get(self.request.session['user'])
        raise AuthenticationError('No valid user')

    def get_limit(self):
        """Return pagination limit from request else default."""
        return int(self.request.params.get('limit', DEFAULT_LIMIT))

    def get_offset(self):
        """Return pagination offset from request else 0."""
        return int(self.request.params.get('offset', 0))
