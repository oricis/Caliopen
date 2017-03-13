import json

from caliopen_main.message.delivery import UserMessageDelivery


class InboundEmail(object):

    def __init__(self, natsConn):
        self.deliver = UserMessageDelivery()
        self.natsConn = natsConn

    def handler(self, msg):
        payload = json.loads(msg.data)
        if payload[u'order'] == "process_email_message":
            try:
                self.deliver.process_inbound_message(payload[u'user_id'], payload[u'message_id'])
            except Exception as exc:
                print("deliver process failed : {}".format(str(exc)))
                self.natsConn.publish(msg.reply, '{"error":' +
                                      json.dumps(str(exc.message)) + ',"message":'
                                      '"inbound email message process failed"}')
                return exc
            self.natsConn.publish(msg.reply, '{"message":' +
                                             '"OK : inbound email message proceeded"}')
