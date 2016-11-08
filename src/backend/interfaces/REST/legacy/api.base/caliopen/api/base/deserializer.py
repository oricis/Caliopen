# -*- coding: utf-8 -*-
"""Caliopen api deserializers."""
from __future__ import absolute_import, print_function, unicode_literals


def json_deserializer(request):
    """Manage json content type."""
    if request.json_body:
        return request.json_body
    return request.body
