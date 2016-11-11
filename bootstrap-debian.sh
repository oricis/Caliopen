#!/bin/bash

apt-get -y update
apt-get -y upgrade
apt-get install -y git libffi-dev python-pip gcc python-dev libssl-dev libev4 libev-dev

# Debian jessie setuptools is a really old version (5.1.x)
# Install a really fresh version of setuptools
wget https://bootstrap.pypa.io/ez_setup.py
python ez_setup.py

# Some package must be installed using pip
pip install --upgrade pip
pip install --upgrade pyasn1


# Create CaliOpen work directory
CALIOPEN_BASE_DIR="/opt/caliopen"
mkdir ${CALIOPEN_BASE_DIR} && cd $_

# Clone repository
git clone https://git.sapienssapide.com/caliopen/monoRepo.git code

# Install python packages
cd ${CALIOPEN_BASE_DIR}/code/src/backend/main/py.storage
python setup.py develop
cd ${CALIOPEN_BASE_DIR}/code/src/backend/main/py.main
python setup.py develop
cd ${CALIOPEN_BASE_DIR}/code/src/backend/interfaces/REST/py.server
python setup.py develop

