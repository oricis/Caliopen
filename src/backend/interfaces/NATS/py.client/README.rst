Entry point
===========

This repository is part of CaliOpen platform. For documentation, installation and
contribution instructions, please refer to https://caliopen.github.io

nats client
============

caliopen_nats package is an interface for py.main to subscribe to "topics" published on NATS server.
For now, it listens for messages with 'inboundSMTP' subject. It triggers the inbound emails processing.

to launch the daemon :

```
$ cd caliopen_nats/
$ python listener.py -f ../../../../configs/caliopen.yaml.template
```