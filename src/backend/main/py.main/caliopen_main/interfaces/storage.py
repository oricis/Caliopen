import zope.interface


class DbIO(zope.interface.Interface):
    """Interface for objects persisted in cassandra"""

    def get_db(**options):
        """Retreive object from db and place it in a _model_class instance"""

    def save_db(**options):
        """"""
    def create_db(**options):
        """"""

    def delete_db(**options):
        """"""

    def update_db(**options):
        """Update values within _model_class from object values and save them"""

    def marshall_db(**options):
        """Create a _model_class instance with current object attributes

        For now, we rely on cassandra's Encoder.
        We could customize this marshaller in future if needed
        """

    def unmarshall_db(**options):
        """Fill object attributes with values from _db"""


class IndexIO(zope.interface.Interface):
    """Interface for objects indexed in Elasticsearch"""

    _index_class = zope.interface.Attribute("dsl model for object")

    def marshall_index(**options):
        """Create a _index_class instance with current object attributes"""

    def unmarshall_index(**options):
        """Fill object's attributes with values from _index"""
