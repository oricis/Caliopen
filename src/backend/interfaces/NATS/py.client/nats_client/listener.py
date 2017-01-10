import argparse
import sys

import tornado.ioloop
import tornado.gen
from nats.io.client import Client as NATS

import subscribers


def show_usage():
    print("nats-sub SUBJECT [-s SERVER] [-q QUEUE]")


def show_usage_and_die():
    show_usage()
    sys.exit(1)


@tornado.gen.coroutine
def main():
    # Parse the command line arguments
    parser = argparse.ArgumentParser()

    # e.g. nats-sub hello -s nats://127.0.0.1:4222
    parser.add_argument('subject', default='hello', nargs='?')
    parser.add_argument('-s', '--servers', default=[], action='append')
    parser.add_argument('-q', '--queue', default="")

    # Parse!
    args = parser.parse_args()

    # Create client and connect to server
    nc = NATS()
    servers = args.servers
    if len(args.servers) < 1:
        servers = ["nats://127.0.0.1:4222"]

    opts = {"servers": servers}
    yield nc.connect(**opts)

    future = nc.subscribe("inboundSMTP", args.queue,
                          subscribers.inbound_email_handler)
    sid = future.result()

if __name__ == '__main__':
    main()
    tornado.ioloop.IOLoop.instance().start()
