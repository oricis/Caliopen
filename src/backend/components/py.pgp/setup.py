import os
import re

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

name = "caliopen_pgp"

with open(os.path.join(*([here] + name.split('.') + ['__init__.py']))) as v_file:
    version = re.compile(r".*__version__ = '(.*?)'", re.S).match(v_file.read()).group(1)

requires = ['dnsknife', 'PGpy']

setup(name=name,
      namespace_packages=[name],
      version=version,
      description='Caliopen PGP backend utilities',
      long_description=README + '\n\n' + CHANGES,
      classifiers=["Programming Language :: Python"],
      author='Caliopen Contributors',
      author_email='',
      url='https://github.com/Caliopen/Caliopen',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=requires,
      )
