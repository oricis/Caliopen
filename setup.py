import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [
    'caliopen.config',
    'caliopen.core',
    'caliopen.messaging',
    # 'git+https://github.com/ekini/gsmtpd.git'  # OK I shouldn't, or not ...
    ]

setup(name='caliopen.smtp',
      namespace_packages=['caliopen'],
      version='0.0.1',
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
