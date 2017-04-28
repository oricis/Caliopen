# -*- coding: utf-8 -*-
"""Caliopen inbound nats message handler."""
from __future__ import absolute_import, print_function, unicode_literals

import logging
import json

from caliopen_main.message.delivery import UserMessageDelivery

log = logging.getLogger(__name__)


class InboundEmail(object):
    """Inbound message class handler."""

    def __init__(self, nats_cnx):
        """Create a new inbound messsage handler from a nats connection."""
        self.deliver = UserMessageDelivery()
        self.natsConn = nats_cnx

    def handler(self, msg):
        """Handle an process_raw nats messages."""
        nats_error = {
            'error': '',
            'message': 'inbound email message process failed'
        }
        nats_success = {
            'message': 'OK : inbound email message proceeded'
        }
        payload = json.loads(msg.data)
        log.info('Get payload order {}'.format(payload['order']))
        if payload['order'] == "process_raw":
            try:
                self.deliver.process_raw(payload[u'user_id'],
                                         payload[u'message_id'])
            except Exception as exc:
                print("deliver process failed : {}".format(exc))
                nats_error['error'] = str(exc.message)
                self.natsConn.publish(msg.reply, json.dumps(nats_error))
                return exc
            self.natsConn.publish(msg.reply, json.dumps(nats_success))
