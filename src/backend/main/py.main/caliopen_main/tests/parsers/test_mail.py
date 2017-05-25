"""Test mail message format processing."""

import unittest
from datetime import datetime

from caliopen_storage.config import Configuration
Configuration.load('../../../../../configs/caliopen.yaml.template', 'global')

from caliopen_main.parsers import MailMessage


def load_mail(filename):
    """Read email from fixtures of an user."""
    # XXX tofix: set fixtures in a more convenient way to not
    # have dirty hacking on relative path
    path = '../fixtures/mail'
    with open('{}/{}'.format(path, filename)) as f:
        data = f.read()
    return data


class TestMailFormat(unittest.TestCase):
    """Test formatting of a mail objet (rfc2822)."""

    def test_signed_mail(self):
        """Test parsing of a pgp signed mail."""
        data = load_mail('pgp_signed_1.eml')
        mail = MailMessage(data)
        self.assertTrue(len(mail.participants) > 1)
        self.assertEqual(len(mail.attachments), 2)
        self.assertEqual(mail.subject, 'signed content')
        self.assertTrue(isinstance(mail.date, datetime))
        expected_date = datetime.strptime("20170421 11:06:58",
                                          "%Y%m%d %H:%M:%S")
        self.assertEqual(mail.date, expected_date)
        expected_features = {'mail_emitter_certificate': None,
                             'mail_emitter_mx_reputation': None,
                             'mail_transport_signed': False,
                             'message_crypted': False,
                             'message_encryption_infos': None,
                             'message_signed': False}

        self.assertEqual(mail.privacy_features, expected_features)


if __name__ == '__main__':
    unittest.main()
