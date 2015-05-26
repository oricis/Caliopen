import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'caliopen.api.user',
    ]

setup(name='caliopen.api.message',
      namespace_packages=['caliopen', 'caliopen.api'],
      version='0.0.1',
      description='Caliopen messages API.',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
                  "Programming Language :: Python",
                  "Framework :: Pyramid"],
      author='Caliopen Contributors',
      author_email='contact@caliopen.org',
      url='https://caliopen.org',
      license='AGPLv3',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=requires,
      )
