"""Test tagger class"""

import unittest

from caliopen_tag.taggers.tagger import MessageTagger
from caliopen_tag.utils import pre_process


class TestPredictTagger(unittest.TestCase):
    """Test tagger."""

    def test_tagger_load_fail_file_not_found(self):
        with self.assertRaises(ValueError):
            MessageTagger("random_cat")

    def test_prepare_msg(self):
        text = pre_process("""<html><body>
                              <h1>Bonjour M. Dupont,</h1>
                              <br>
                              <p>Voici le contenu de mon message.</p>
                              </body></html>""", html=True)
        self.assertEqual(text, "bonjour m. dupont , "
                               "voici le contenu de mon message .")
