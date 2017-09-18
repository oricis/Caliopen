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

from caliopen_pi.features.importance_level import compute_inbound


class MockPI(object):

    def __init__(self, technic, context, comportment):
        self.technic = technic
        self.context = context
        self.comportment = comportment


class MockMessage(object):

    def __init__(self, pi, features, tags=None, refs=None):
        self.pi = pi
        self.privacy_features = features
        self.tags = tags if tags else []
        self.external_references = refs if refs else []


class TestInboundImportanceLevel(unittest.TestCase):

    def test_max_spam(self):
        pi = MockPI(0, 0, 0)
        features = {'is_spam': True, 'spam_score': 100.0}
        message = MockMessage(pi, features)
        score = compute_inbound(None, message, [])
        self.assertEqual(score, -5.0)

    def test_half_spam(self):
        pi = MockPI(0, 0, 0)
        features = {'is_spam': True, 'spam_score': 50.0}
        message = MockMessage(pi, features)
        score = compute_inbound(None, message, [])
        self.assertEqual(score, -2.5)

    def test_max_pi_context(self):
        pi = MockPI(0, 100, 0)
        features = {}
        message = MockMessage(pi, features)
        score = compute_inbound(None, message, [])
        self.assertEqual(score, 1.25)

    def test_max_pi_comportment(self):
        pi = MockPI(0, 0, 100)
        features = {}
        message = MockMessage(pi, features)
        score = compute_inbound(None, message, [])
        self.assertEqual(score, 2.5)

    def test_max_pi_context_comportment(self):
        pi = MockPI(0, 100, 100)
        features = {}
        message = MockMessage(pi, features)
        score = compute_inbound(None, message, [])
        self.assertEqual(score, 3.75)
