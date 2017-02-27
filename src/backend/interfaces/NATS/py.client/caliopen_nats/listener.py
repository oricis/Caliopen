import argparse
import sys

import tornado.ioloop
import tornado.gen
from nats.io import Client as NATS

from caliopen_storage.config import Configuration
from caliopen_storage.helpers.connection import connect_storage


def show_usage():
    print("nats-sub SUBJECT [-s SERVER] [-q QUEUE]")


def show_usage_and_die():
    show_usage()
    sys.exit(1)


@tornado.gen.coroutine
def main():
    # Create client and connect to server
    nc = NATS()
    servers = ["nats://127.0.0.1:4222"]

    opts = {"servers": servers}
    yield nc.connect(**opts)

    # create and register subscriber(s)
    inbound_email_sub = subscribers.InboundEmail()
    future = nc.subscribe("inboundSMTP", "",
                          inbound_email_sub.handler)
    sid = future.result()

if __name__ == '__main__':
    # load Caliopen config
    args = sys.argv
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', dest='conffile')
    kwargs = parser.parse_args(args[1:])
    kwargs = vars(kwargs)
    Configuration.load(kwargs['conffile'], 'global')
    # need to load config before importing subscribers
    import subscribers

    connect_storage()
    main()
    tornado.ioloop.IOLoop.instance().start()
