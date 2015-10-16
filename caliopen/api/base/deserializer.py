# -*- coding: utf-8 -*-
from __future__ import unicode_literals


def json_deserializer(request):
    """Manage json content type."""
    if request.json_body:
        return request.json_body
    return request.body
