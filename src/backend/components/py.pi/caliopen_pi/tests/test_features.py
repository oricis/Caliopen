"""Test spam privacy feature extraction."""

import unittest
import os
import uuid

from caliopen_storage.config import Configuration

if 'CALIOPEN_BASEDIR' in os.environ:
    conf_file = '{}/src/backend/configs/caliopen.yaml.template'. \
                format(os.environ['CALIOPEN_BASEDIR'])
else:
    conf_file = '../../../../../configs/caliopen.yaml.template'

Configuration.load(conf_file, 'global')

from mailbox import Message
from caliopen_main.message.parsers.mail import MailMessage
from caliopen_main.message.parameters import NewMessage
from caliopen_pi.features.mail import InboundMailFeature


class FakeUser(object):

    name = 'test'
    user_id = uuid.uuid4()


def load_mail(filename):
    """Read email from fixtures of an user."""
    # XXX tofix: set fixtures in a more convenient way to not
    # have dirty hacking on relative path
    dir_path = os.path.dirname(os.path.realpath(__file__))
    path = '{}/fixtures'.format(dir_path)
    with open('{}/{}'.format(path, filename)) as f:
        data = f.read()
    return Message(data)


class TestEncyption(unittest.TestCase):
    """Test encryption features."""

    def test_no_encryption_signature(self):
        mail = load_mail('spam1.eml')
        message = MailMessage(mail)
        param = NewMessage()
        user = FakeUser()
        featurer = InboundMailFeature(message, {})
        featurer.process(user, param, ([]))
        feats = param.privacy_features
        self.assertEqual(feats.get('message_signed'), False)
        self.assertEqual(feats.get('message_encrypted'), False)
        self.assertEqual(feats.get('message_encryption_method'), '')
        self.assertEqual(feats.get('message_signature_type'), '')
        self.assertEqual(feats.get('transport_signed'), False)

    def test_transport_signature(self):
        mail = load_mail('dkim1.eml')
        message = MailMessage(mail)
        param = NewMessage()
        user = FakeUser()
        featurer = InboundMailFeature(message, {})
        featurer.process(user, param, ([]))
        feats = param.privacy_features
        self.assertEqual(feats.get('transport_signed'), True)

    def test_encrypted_message(self):
        mail = load_mail('pgp_crypted_1.eml')
        message = MailMessage(mail)
        param = NewMessage()
        user = FakeUser()
        featurer = InboundMailFeature(message, {})
        featurer.process(user, param, ([]))
        feats = param.privacy_features
        self.assertEqual(feats.get('message_encrypted'), True)
        self.assertEqual(feats.get('message_encryption_method'), 'pgp')
