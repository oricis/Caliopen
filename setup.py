import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'caliopen.base',
]

setup(name='caliopen.cli',
      namespace_packages=['caliopen'],
      version='0.0.1',
      description='Caliopen Command Line Interface`',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
        "Programming Language :: Python",
        "Topic :: Shell",
        ],
      author='Caliopen Contributors',
      author_email='',
      url='https://github.com/Caliopen/caliopen.cli',
      keywords='caliopen cli',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=requires,
      test_suite="caliopen.cli.tests",
      entry_points={
          'console_scripts': 'caliopen = caliopen.cli.cli:main',
      })
