import unittest
import os

from datetime import datetime
from zope.interface.verify import verifyObject

from caliopen_storage.config import Configuration

import vobject

if 'CALIOPEN_BASEDIR' in os.environ:
    conf_file = '{}/src/backend/configs/caliopen.yaml.template'. \
                format(os.environ['CALIOPEN_BASEDIR'])
else:
    conf_file = '../../../../../configs/caliopen.yaml.template'

Configuration.load(conf_file, 'global')

from caliopen_main.common.helpers.normalize import clean_email_address


class TestEmailParser(unittest.TestCase):

    def test_simple_1(self):
        email = 'toto@toto.fr'
        res = clean_email_address(email)
        self.assertEqual(email, res[0])
        self.assertEqual(email, res[1])

    def test_with_name_1(self):
        email = '"Ceci est, une virgule" <test@toto.com>'
        res = clean_email_address(email)
        self.assertEqual('test@toto.com', res[0])
        self.assertEqual('test@toto.com', res[1])

    def test_multiple(self):
        emails = '"Ceci est, une virgule" <test@toto.com>, ' \
                 '"Est une, autre virgule" <test2@toto.tld>'
        parts = emails.split('>,')
        self.assertEqual(len(parts), 2)
        for part in parts:
            res = clean_email_address(part)
            self.assertTrue('@' in res[0])

    def test_invalid_but_valid(self):
        email = 'Ceci [lamentable.ment] <email@truc.tld>'
        res = clean_email_address(email)
        self.assertEqual('email@truc.tld', res[0])

    def test_strange_1(self):
        email = 'ideascube/ideascube <ideascube@noreply.github.com>'
        res = clean_email_address(email)
        self.assertEqual('ideascube@noreply.github.com', res[0])
