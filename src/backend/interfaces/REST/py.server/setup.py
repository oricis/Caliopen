import os
import sys

from setuptools import setup, find_packages

PY3 = sys.version_info[0] == 3

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'pyramid_jinja2',
    'caliopen.api.user',
    'pyramid_kvs',
    'waitress',
    ]

tests_require = ['nose', 'coverage']
if sys.version_info < (3, 3):
    tests_require.append('mock')


extras_require = {
    'dev': [
        'pyramid_debugtoolbar',
    ],
    'doc': [
        'sphinx',
    ],
    'test': tests_require
}

setup(name='caliopen.api',
      namespace_packages=['caliopen', 'caliopen.api'],
      version='0.0.1',
      description='Caliopen REST API Server',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
          "Programming Language :: Python",
          "Framework :: Pyramid",
          "Topic :: Internet :: WWW/HTTP",
          "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
      ],
      author='Caliopen Contributors',
      author_email='',
      url='https://github.com/Caliopen/caliopen.api',
      license='AGPLv3',
      keywords='web pyramid api rest',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=tests_require,
      extras_require=extras_require,
      test_suite="caliopen.api.tests",
      entry_points={
          'paste.app_factory': ['main = caliopen.api:main'],
      })
