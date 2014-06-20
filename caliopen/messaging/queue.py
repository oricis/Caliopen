# -*- coding: utf-8 -*-
import logging as log
from urllib2 import URLError

from kombu import BrokerConnection, Connection, Exchange, Queue
from kombu.mixins import ConsumerMixin


class KombuConfReader(object):
    def __init__(self, config):
        self.broker_url = config['url']
        self.broker_backup_url = config.get('backup_url')
        self.routing_key = config['queue']['routing_key']
        self.serializer = config.get('serializer', 'json')
        self.compression = config.get('compression', None)
        self.exchange_name = config['exchange']['name']
        self.exchange_type = config['exchange'].get('type', 'direct')
        self.exchange_is_durable = config['exchange'].get('durable', False)
        self.queue_name = config['queue']['name']
        self.queue_is_durable = config['queue'].get('durable', False)

        if config['queue'].get('arguments'):
            self.queue_args = config['queue']['arguments']
        else:
            self.queue_args = None


class Publisher(KombuConfReader):

    def __init__(self, config):
        self._log = log.getLogger()
        KombuConfReader.__init__(self, config)

        self.connection = Connection(self.broker_url)
        try:
            self._init_amqp()
        except Exception, exc:
            self._log.error('Publisher fail in init connection: %s' % exc)
            raise

    def _init_amqp(self):
        """Init AMQP objects after connection"""
        self.producer = self.connection.Producer()
        self.exchange = Exchange(
            self.exchange_name,
            channel=self.connection.channel(),
            type=self.exchange_type,
            durable=self.exchange_is_durable)

        self.queue = Queue(
            self.queue_name,
            self.exchange,
            channel=self.connection.channel(),
            durable=self.queue_is_durable,
            routing_key=self.routing_key,
            queue_arguments=self.queue_args)

        # We declare object to broker. this way only we can
        # ensure to publish to an existing queue and routing_key
        # AMQP work this way, not a library principle
        self.exchange.declare()
        self.queue.declare()

    def switch_connection(self):
        """Switch AMQP connection from url to backup_url and vice versa"""
        self._log.warn('Switching AMQP connection from %s' %
                       self.connection.as_uri())
        if (self.connection.hostname in self.broker_url
                and self.broker_backup_url):
            self.connection = Connection(self.broker_backup_url)
        elif self.connection.hostname in self.broker_backup_url:
            self.connection = Connection(self.broker_url)
        else:
            raise URLError('Invalid current URI to switch connection : %s' %
                           self.connection.as_uri())
        self._init_amqp()

    def _publish(self, msg):
        """Publish message ensuring connection is available"""
        publish = self.connection.ensure(
            self.producer, self.producer.publish, max_retries=3)

        publish(msg, exchange=self.exchange,
                routing_key=self.routing_key,
                serializer=self.serializer,
                compression=self.compression)

        return True

    def publish(self, msg):
        """
        must return True/False if message is well publish or not
        """
        try:
            return self._publish(msg)
        except Exception, exc:
            try:
                self.switch_connection()
                return self._publish(msg)
            except Exception, exc:
                self._log.error('Publish fail when switching connection: %s' %
                                exc)
            return False


class Consumer(ConsumerMixin, KombuConfReader):
    """Subscribe to kombu consumers and poll messages"""
    def __init__(self, config, handler):
        ConsumerMixin.__init__(self)
        KombuConfReader.__init__(self, config)

        self._handler = handler

        self.exchange = Exchange(
            self.exchange_name,
            type=self.exchange_type,
            durable=self.queue_is_durable)

        self.queue = Queue(
            self.queue_name,
            self.exchange,
            durable=self.queue_is_durable,
            routing_key=self.routing_key,
            queue_arguments=self.queue_args)

        self.connection = None

    def get_consumers(self, consumer, channel):
        return [consumer(queues=self.queue,
                         callbacks=[self._handler])]

    def connect(self):
        self.connection = BrokerConnection(self.broker_url)

    def start(self):
        self.connect()
        self.loop()

    def loop(self):
        with self.connection:
            self.run()
