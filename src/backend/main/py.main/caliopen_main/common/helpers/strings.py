# -*- coding: utf-8 -*-
"""helpers to work with strings"""
from __future__ import absolute_import, unicode_literals
import re


def unicode_truncate(s, length):
    """"
    unicode_truncate truncates `s` string after `length` bytes
    then removes tailing bytes if they are making up a partial unicode
    """
    if isinstance(s, str):
        s = s.decode("utf8", 'ignore')

    partial = s[:length]
    return re.sub(
        "([\xf6-\xf7][\x80-\xbf]{0,2}|[\xe0-\xef][\x80-\xbf]{0,1}|[\xc0-\xdf])$",
        "", partial)
