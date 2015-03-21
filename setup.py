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
    'cqlengine',
    'schematics',
    ]

setup(name='caliopen.base',
      namespace_packages=['caliopen'],
      version='0.0.1',
      description='Caliopen base package.',
      long_description=README + '\n\n' + CHANGES,
      classifiers=["Programming Language :: Python", ],
      author='',
      author_email='',
      url='',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=requires,
      )
