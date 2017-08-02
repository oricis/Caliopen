# -*- coding: utf-8 -*-
"""Caliopen tags parameters."""

from schematics.models import Model
from schematics.types import StringType, UUIDType


class ResourceTag(Model):
    """Tag related to a resource."""

    tag_id = UUIDType()
    name = StringType()
    type = StringType()
