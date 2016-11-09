import os
import sys

from setuptools import setup, find_packages

PY3 = sys.version_info[0] == 3

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'pyramid_jinja2',
    'caliopen_storage',
    'caliopen_main',
    'pyramid_kvs',
    'waitress',
    'cornice==1.2.1',
    'colander'
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

setup(name='caliopen_api',
      namespace_packages=['caliopen_api'],
      version='0.0.2',
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
      test_suite="caliopen_api.tests",
      entry_points={
          'paste.app_factory': ['main = caliopen_api:main'],
      })
