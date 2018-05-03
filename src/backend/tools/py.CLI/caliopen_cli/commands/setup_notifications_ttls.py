"""Create a user with a password in a Calipen instance."""
from __future__ import absolute_import, print_function, unicode_literals

import logging

log = logging.getLogger(__name__)


def setup_notifications_ttls():
    """Fill up table `notification_ttl` with default ttls in seconds"""

    from caliopen_main.notification.core import NotificationTtl

    default_ttls = {
        "short-lived": 60,  # a minute
        "mid-lived": 3600,  # an hour
        "long-lived": 43200,  # 12 hours
        "short-term": 86400,  # a day
        "mid-term": 172800,  # 2 days
        "long-term": 1728000,  # 10 days
        "forever": 0
    }

    for k, v in default_ttls.items():
        NotificationTtl.create(ttl_code=k, ttl_duration=v)

    log.info('{} default ttls have been set'.format(len(default_ttls)))
