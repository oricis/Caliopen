"""Test spam privacy feature extraction."""

import unittest
import os

from caliopen_storage.config import Configuration

if 'CALIOPEN_BASEDIR' in os.environ:
    conf_file = '{}/src/backend/configs/caliopen.yaml.template'. \
                format(os.environ['CALIOPEN_BASEDIR'])
else:
    conf_file = '../../../../../configs/caliopen.yaml.template'

Configuration.load(conf_file, 'global')

from mailbox import Message
from caliopen_pi.features.spam import SpamScorer


def load_mail(filename):
    """Read email from fixtures of an user."""
    # XXX tofix: set fixtures in a more convenient way to not
    # have dirty hacking on relative path
    dir_path = os.path.dirname(os.path.realpath(__file__))
    path = '{}/fixtures'.format(dir_path)
    with open('{}/{}'.format(path, filename)) as f:
        data = f.read()
    return Message(data)


class TestSpamScorer(unittest.TestCase):
    """Test spam scorer."""

    def test_spam1(self):
        mail = load_mail('spam1.eml')
        scorer = SpamScorer(mail)
        self.assertFalse(scorer.is_spam)
        self.assertEqual(scorer.method, 'score')
        self.assertEqual(scorer.score, 0.0)

    def test_spam2(self):
        mail = load_mail('spam2.eml')
        scorer = SpamScorer(mail)
        self.assertTrue(scorer.is_spam)
        self.assertEqual(scorer.method, 'status')
        self.assertEqual(scorer.score, 51.0)

    def test_spam3(self):
        mail = load_mail('spam3.eml')
        scorer = SpamScorer(mail)
        self.assertTrue(scorer.is_spam)
        self.assertEqual(scorer.method, 'status')
        self.assertEqual(scorer.score, 97.0)
