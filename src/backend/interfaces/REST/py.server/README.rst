Entry point
===========

This repository is part of CaliOpen platform. For documentation, installation and
contribution instructions, please refer to https://caliopen.github.io

caliopen.api
============

caliopen_api package is a simple Pyramid container to include CaliOpen Rest API services.

Local Installation
------------------

To install local dependencies, use `pip <https://pip.pypa.io/en/latest/>`_:

::

    pip install -e ".[dev,test]"

Then install supported components and include them under caliopen.api.services
in pyramid configuration file.

::

    caliopen.api.services = caliopen.api.user
                            caliopen.api.message

You will need storage services running locally, cassandra, elasticsearch
and a redis instance.

`caliopen.cli <https://github.com/caliopen/caliopen.cli>`_, should be used
to create user and load mail data.


Running API
-----------

::

    cd src/backend/main
    ./startup


Components
----------

Current components are :

* `caliopen_api.user`
* `caliopen_api.message`
* `caliopen_api.base`

Tests
-----

Tests are launched using `nose <https://nose.readthedocs.org/en/latest/>`_.

::

    nosetests -sxv caliopen/api/tests/*.py
