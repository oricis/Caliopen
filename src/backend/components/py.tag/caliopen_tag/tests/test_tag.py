"""Test spam privacy feature extraction."""

import unittest
import os

from caliopen_storage.config import Configuration

if 'CALIOPEN_BASEDIR' in os.environ:
    conf_file = '{}/src/backend/configs/caliopen.yaml.template'. \
                format(os.environ['CALIOPEN_BASEDIR'])
else:
    conf_file = '../../../../configs/caliopen.yaml.template'

Configuration.load(conf_file, 'global')

from mailbox import Message
from caliopen_tag.taggers.tagger import MessageTagger, prepare_msg


class TestPredictTagger(unittest.TestCase):
    """Test tagger."""

    def test_tagger_load(self):
        qualifier = MessageTagger()
        self.assertEqual(len(qualifier.process("coucou\n")), 5)
        self.assertEqual(qualifier.process("coucou\n")[0][0], "others")

    def test_tagger_load_cat2(self):
        qualifier = MessageTagger("cat2", 2)
        self.assertEqual(len(qualifier.process("coucou\n")), 2)
        self.assertEqual(qualifier.process("coucou\n")[0][0], "others")

    def test_tagger_load_fail_file_not_found(self):
        with self.assertRaises(ValueError):
            MessageTagger("cat3")

    def test_tagger_load_fail_wrong_file_format(self):
        with self.assertRaises(ValueError):
            MessageTagger("cat4")

    def test_prepare_msg(self):
        text = prepare_msg("""<html><body>
                              <h1>Bonjour M. Dupont,</h1>
                              <br>
                              <p>Voici le contenu de mon message .</p>
                              </body></html>""")
        self.assertEqual(text, "bonjour m. dupont , voici le contenu de mon message .")