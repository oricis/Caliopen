import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = ['kombu']

setup(name='caliopen.messaging',
      namespace_packages=['caliopen'],
      version='0.0.1',
      description='Caliopen Messaging',
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
      tests_require=requires,
      )
