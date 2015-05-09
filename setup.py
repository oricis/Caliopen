import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'caliopen.base',
    'caliopen.base.user',
    ]

setup(name='caliopen.base.message',
      namespace_packages=['caliopen.base'],
      version='0.0.1',
      description='Caliopen base package for message management.',
      long_description=README + '\n\n' + CHANGES,
      classifiers=["Programming Language :: Python", ],
      author='Aymeric Barantal',
      author_email='mric@gandi.net',
      url='https://caliopen.org',
      license='AGPLv3',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=requires,
      )
