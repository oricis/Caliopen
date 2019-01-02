"""Test spam privacy feature extraction."""

import unittest
import os

from caliopen_storage.config import Configuration
# from mailbox import Message
from caliopen_tag.taggers.tagger import MessageTagger, prepare_msg

if 'CALIOPEN_BASEDIR' in os.environ:
    conf_file = '{}/src/backend/configs/caliopen.yaml.template'. \
                format(os.environ['CALIOPEN_BASEDIR'])
else:
    conf_file = '../../../../configs/caliopen.yaml.template'

Configuration.load(conf_file, 'global')


class TestPredictTagger(unittest.TestCase):
    """Test tagger."""

    def test_tagger_load_fail_file_not_found(self):
        with self.assertRaises(ValueError):
            MessageTagger("random_cat")

    def test_prepare_msg(self):
        text = prepare_msg("""<html><body>
                              <h1>Bonjour M. Dupont,</h1>
                              <br>
                              <p>Voici le contenu de mon message .</p>
                              </body></html>""")
        self.assertEqual(text, "bonjour m. dupont , "
                               "voici le contenu de mon message .")
