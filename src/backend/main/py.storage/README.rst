Entry point
===========

This repository is part of CaliOpen platform. For documentation, installation and
contribution instructions, please refer to https://caliopen.github.io

Caliopen Storage
=============

This is the base storage package for caliopen platform.

It contains following sub packages:

    store 
        All classes related to datastore.
        Base model User and Contact are included.

    core
        Classes where business logic must be define.
        Datastores objects are not directly managed,
        they must have a related core class to act as
        an interface with others caliopen components.

    helpers
        Some common helpers for all caliopen parts.


Notes
-----

waitress and cassandra driver conflict
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cassandra python driver use async_core by default and can
conflict with waitress event loop (1). It is advocated to install
libev on your system to avoid this problem (2).

(1) https://github.com/Pylons/waitress/issues/63
(2) http://datastax.github.io/python-driver/installation.html#c-extensions
