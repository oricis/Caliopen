
import tornado.ioloop
import tornado.gen

import json

from nats.io.client import Client
from caliopen_storage.config import Configuration


def make_message(user):
    notif = {
        'message': 'created',
        'user_name': '{0}'.format(user.name),
        'user_id': '{0}'.format(user.user_id)
    }
    return json.dumps(notif)


@tornado.gen.coroutine
def main(user):
    nc = Client()
    try:
        server = Configuration('global').get('message_queue')
        opts = {"servers": ['nats://{}:{}'.format(server['host'],
                                                  server['port'])]}
        print('Connecting to {}'.format(server))
        yield nc.connect(**opts)
        data = make_message(user)
        yield nc.publish('userAction', data)
        yield nc.flush()
        print("Published to '{0}'".format(data))
    except Exception as exc:
        print(exc)
        raise exc


def run_with_args(func, *args):
    return func(*args)


def welcome_user(user):
    tornado.ioloop.IOLoop.current().run_sync(lambda: main(user), timeout=5)
