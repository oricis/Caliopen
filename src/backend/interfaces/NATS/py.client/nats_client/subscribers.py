import json

from caliopen_main.message.delivery import UserMessageDelivery


class InboundEmail(object):

    def __init__(self):
        self.deliver = UserMessageDelivery()

    def handler(self, msg):
        print("[Received: {0}] {1}".format(msg.subject, msg.data))
        payload = json.loads(msg.data)
        self.deliver.process(payload["user_id"], payload["raw_email_id"])

