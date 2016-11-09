import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'phonenumbers',
    'dnsknife',
    'PGpy',
    'caliopen_storage'
    ]

extras_require = {
    'dev': [],
    'test': [
        'coverage',
        'docker-py',
        'freezegun',
        'nose'
    ],
}

setup(name='caliopen_main',
      namespace_packages=['caliopen_main'],
      version='0.0.2',
      description='Caliopen main package. Entry point for whole application',
      long_description=README + '\n\n' + CHANGES,
      classifiers=["Programming Language :: Python", ],
      author='Caliopen contributors',
      author_email='contact@caliopen.org',
      url='https://caliopen.org',
      license='AGPLv3',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      extras_require=extras_require,
      install_requires=requires,
      tests_require=requires,
      )
