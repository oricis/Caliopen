Caliopen Base
=============

This is the base package for caliopen platform.

It contains following sub packages:

- store : All classes related to datastore.
          Base model User and Contact are included.

- core : Classes where business logic must be define.
         Datastores objects are not directly managed,
         they must have a related core class to act as
         an interface with others caliopen components.

- helpers : Some common helpers for all caliopen parts.
