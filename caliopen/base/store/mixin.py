"""Caliopen mixins related to store."""


class IndexTagMixin(object):

    """Mixin for indexed objects havings tags."""

    def add_tag(self, tag):
        """Add a tag to indexed object."""
        if tag in self.tags:
            return False
        query = {
            'script': 'ctx._source.tags += tag',
            'params': {'tag': tag}
        }
        self.update(query)
        self.refresh()
        return True

    def remove_tag(self, tag):
        """Remove tag from indexed object."""
        if tag not in self.tags:
            return False
        query = {
            'script': 'ctx._source.tags -= tag',
            'params': {'tag': tag}
        }
        self.update(query)
        self.refresh()
        return True

    def set_tags(self, tags):
        """Set tag list for an indexed object."""
        if tags == self.tags:
            return False
        query = {
            'script': 'ctx._source.tags = tags',
            'params': {'tags': tags}
        }
        self.update(query)
        self.refresh()
        return True
