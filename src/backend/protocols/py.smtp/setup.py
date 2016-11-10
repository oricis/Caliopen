import os
import re

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

name = "caliopen_smtp"

with open(os.path.join(*([here] + name.split('.') + ['__init__.py']))) as v_file:
    version = re.compile(r".*__version__ = '(.*?)'", re.S).match(v_file.read()).group(1)

requires = [
    'caliopen_main',
    'caliopen_storage',
    'caliopen_messaging',
    # 'git+https://github.com/ekini/gsmtpd.git'  # OK I shouldn't, or not ...
    ]

setup(name=name,
      namespace_packages=[name],
      version=version,
      description='A poc for the Caliop project.',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
        "Programming Language :: Python",
        ],
      author='Caliopen Contributors',
      author_email='',
      url='https://github.com/caliopen',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=requires
      )
