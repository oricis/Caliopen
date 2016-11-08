import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'setuptools',
    'bcrypt',
    'PyYAML',
    'elasticsearch-dsl',
    'cassandra-driver==3.4.1',
    'schematics',
    'simplejson',
    ]

extras_require = {
    'dev': [],
    'test': ['nose', 'coverage', 'freezegun', 'docker-py'],
}


setup(name='caliopen-storage',
      namespace_packages=['caliopen-storage'],
      version='0.0.2',
      description='Caliopen base package for storage routines.',
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
