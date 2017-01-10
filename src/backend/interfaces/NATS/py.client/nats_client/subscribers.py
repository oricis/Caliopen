def inbound_email_handler(msg):
    print("[Received: {0}] {1}".format(msg.subject, msg.data))
