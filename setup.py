import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'caliopen.base',
    ]

extras_require = {
    'dev': [],
    'test': [],
}

setup(name='caliopen.base.user',
      namespace_packages=['caliopen', 'caliopen.base'],
      version='0.0.1',
      description='Caliopen base package for user management.',
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
