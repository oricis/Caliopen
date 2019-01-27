"""Test model manager class"""

import unittest
import os

from caliopen_storage.config import Configuration
from caliopen_tag.models_manager import ESDataManager

if 'CALIOPEN_BASEDIR' in os.environ:
    conf_file = '{}/src/backend/configs/caliopen.yaml.template'. \
                format(os.environ['CALIOPEN_BASEDIR'])
else:
    conf_file = '../../../../configs/caliopen.yaml.template'

Configuration.load(conf_file, 'global')


class MockMessage:
    def __init__(self, content, tags):
        self.body_plain = content
        self.tags = tags


class TestModelManager(unittest.TestCase):
    """Test model manager."""

    def test_ESDataManager_format_item(self):
        es_provider = ESDataManager({"elasticsearch": {"url": "mock"}})

        message = MockMessage("""<body><p>Bonjour M. Dupont,</p>
                              Voici le contenu de mon message.
                              <a href="" alt="">lien de la page.</a></body>""",
                              ["social", "important"])

        text = es_provider._format_item(message)
        self.assertEqual(text, "__label__social __label__important bonjour m. "
                               "dupont , voici le contenu de mon message . "
                               "lien de la page .")
