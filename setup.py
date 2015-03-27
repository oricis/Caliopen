import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'caliopen.base',
    'pyramid',
    'zope.interface',
    'cornice',
    'waitress',
    ]

setup(name='caliopen.api.base',
      namespace_packages=['caliopen.api'],
      version='0.0.1',
      description='Caliopen base REST API package.',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
                  "Programming Language :: Python",
                  "Framework :: Pyramid"],
      author='Caliopen Contributors',
      author_email='',
      url='https://github.com/Caliopen/caliopen.api.base',
      license='AGPLv3',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=requires,
      )
