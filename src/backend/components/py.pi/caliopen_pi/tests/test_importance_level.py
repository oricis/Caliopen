"""Test importance level compute."""

import unittest
import os

from caliopen_storage.config import Configuration

if 'CALIOPEN_BASEDIR' in os.environ:
    conf_file = '{}/src/backend/configs/caliopen.yaml.template'. \
                format(os.environ['CALIOPEN_BASEDIR'])
else:
    conf_file = '../../../../../configs/caliopen.yaml.template'

Configuration.load(conf_file, 'global')

from caliopen_pi.features.helpers.importance_level import compute_importance


class MockPI(object):

    def __init__(self, technic, context, comportment):
        self.technic = technic
        self.context = context
        self.comportment = comportment


class MockMessage(object):

    def __init__(self, pi, tags=None, refs=None):
        self.pi = pi
        self.tags = tags if tags else []
        self.external_references = refs if refs else []


class TestInboundImportanceLevel(unittest.TestCase):

    def test_max_spam(self):
        pi = MockPI(0, 0, 0)
        features = {'is_spam': True, 'spam_score': 100.0}
        message = MockMessage(pi)
        score = compute_importance(None, message, features, [])
        self.assertEqual(score, -5)

    def test_half_spam(self):
        pi = MockPI(0, 0, 0)
        features = {'is_spam': True, 'spam_score': 50.0}
        message = MockMessage(pi)
        score = compute_importance(None, message, features, [])
        self.assertEqual(score, -3)

    def test_max_pi_context(self):
        pi = MockPI(0, 100, 0)
        features = {}
        message = MockMessage(pi)
        score = compute_importance(None, message, features, [])
        self.assertEqual(score, 1)

    def test_max_pi_comportment(self):
        pi = MockPI(0, 0, 100)
        features = {}
        message = MockMessage(pi)
        score = compute_importance(None, message, features, [])
        self.assertEqual(score, 3)

    def test_max_pi_context_comportment(self):
        pi = MockPI(0, 100, 100)
        features = {}
        message = MockMessage(pi)
        score = compute_importance(None, message, features, [])
        self.assertEqual(score, 4)
