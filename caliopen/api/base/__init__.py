from caliopen.base.config import Configuration
from caliopen.api.base.config import includeme

DEFAULT_LIMIT = 20


def make_url(url):
    # XXX : should use cornice.route_prefix configuration
    BASE_URL = Configuration('global').get('api.url', '/api')
    return '%s%s' % (BASE_URL, url)


class Api(object):

    """Base class for all Api."""

    def __init__(self, context, request):
        self.request = request
        self.context = context

    def get_limit(self):
        """Return pagination limit from request else default."""
        return int(self.request.params.get('limit', DEFAULT_LIMIT))

    def get_offset(self):
        """Return pagination offset from request else 0."""
        return int(self.request.params.get('offset', 0))
