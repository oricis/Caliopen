# -*- coding: utf-8 -*-

from .provider import DataProvider, FileDataProvider, ESProvider
from .interface import IDataProvider

__version__ = '0.1.0'


__all__ = ['IDataProvider', 'DataProvider', 'FileDataProvider', 'ESProvider']
