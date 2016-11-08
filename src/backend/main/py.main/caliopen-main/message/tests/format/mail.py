"""Test mail message format processing."""

import unittest
from datetime import datetime

from caliopen-storage.message.format.mail import MailMessage
from caliopen-storage.tests.fixtures.helpers import load_mail


class TestMailFormat(unittest.TestCase):

    """Test formatting of a mail objet (rfc2822)."""

    def test_01(self):
        data = load_mail('01.elm')
        mail = MailMessage(data)
        self.assertEqual(mail.recipients['cc'], [])
        self.assertEqual(mail.recipients['bcc'], [])
        self.assertNotEqual(mail.recipients['from'], [])
        self.assertNotEqual(mail.recipients['to'], [])
        self.assertEqual(len(mail.recipients['from']), 1)
        self.assertEqual(len(mail.parts), 2)
        # TOFIX : subject should be decoded
        subject = '=?utf-8?Q?Docker=20Weekly=3A=20March=2011th=202014?='
        self.assertEqual(mail.subject, subject)
        self.assertTrue(isinstance(mail.date, datetime))


if __name__ == '__main__':
    unittest.main()
