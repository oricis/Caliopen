import os
import re

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

name = "caliopen_climl"

version_file = os.path.join(*([here] + name.split('.') + ['__init__.py']))
with open(version_file) as v_file:
    comp = re.compile(r".*__version__ = '(.*?)'", re.S)
    version = comp.match(v_file.read()).group(1)

requires = [
    'click'
]

if (os.path.isfile('./requirements.deps')):
    with open('./requirements.deps') as f_deps:
        requires.extend(f_deps.read().split('\n'))

setup(name=name,
      namespace_packages=[name],
      version=version,
      description='Caliopen CLI interface for Machine Learning tasks`',
      long_description=README + '\n\n' + CHANGES,
      classifiers=["Programming Language :: Python",
                   "Topic :: Shell"],
      author='Caliopen Contributors',
      author_email='',
      url='https://github.com/Caliopen',
      keywords='caliopen machine learning CLI',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=requires,
      test_suite="caliopen_climl.cli.tests",
      entry_points={
          'console_scripts': 'caliopml = caliopen_climl.cli:cli',
      })
