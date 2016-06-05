"""Caliopen mixins related to store."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from cassandra.cqlengine import columns

log = logging.getLogger(__name__)


class IndexedModelMixin(object):

    """Mixin to transform model into indexed documents."""

    def __process_udt(self, column, attr, idx_udt):
        """Process a cassandra UDT column to translate into nested index."""
        attr_udt = getattr(attr, column.column_name)
        for col_name, col_value in attr_udt.items():
            if col_value is not None:
                setattr(idx_udt, col_name, col_value)

    def _process_column(self, column, attr, idx, is_list=False):
        """Process a core column and translate into index document."""
        col_name = column.column_name
        try:
            idx_attr = getattr(idx, col_name)
        except AttributeError:
            # print('  not indexed column {}'.format(col_name))
            return

        if isinstance(attr, list):
            is_udt = isinstance(column.sub_types[0], columns.UserDefinedType)
            for new_attr in attr:
                if is_udt:
                    self._process_udt(column, new_attr, idx_attr)
                else:
                    self._process_column(column, new_attr, idx, is_list=True)
        elif isinstance(column, columns.UserDefinedType):
            self._process_udt(column, attr, idx_attr)
        else:
            col_value = getattr(attr, col_name)
            if is_list:
                idx_attr.append(col_value)
            else:
                setattr(idx, col_name, col_value)

    def create_index(self):
        """Translate a model object into an indexed document."""
        if not self._index_class:
            return False
        idx = self._index_class()
        idx.meta.index = self.user_id

        for name, desc in self._columns.items():
            if desc.is_primary_key:
                if name != 'user_id':
                    idx.meta.id = getattr(self, name)
            else:
                self._process_column(desc, self, idx)

        idx.save(using=idx.client())
        return True
