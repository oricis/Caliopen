#!/bin/bash

apt-get -y update
apt-get -y upgrade
apt-get install -y git libffi-dev python-pip gcc python-dev libssl-dev libev4 libev-dev

apt-get install redis-server

# Debian jessie setuptools is a really old version (5.1.x)
# Install a really fresh version of setuptools
wget -q https://bootstrap.pypa.io/ez_setup.py
python ez_setup.py

# Some package must be installed using pip and upgraded to latest
pip install --upgrade pip
pip install --upgrade pyasn1


# Create CaliOpen work directory
CALIOPEN_BASE_DIR="/opt/caliopen"
mkdir ${CALIOPEN_BASE_DIR}
mkdir ${CALIOPEN_BASE_DIR}/ext && cd $_

# Install storage engines
CASSANDRA_VERSION="3.0.9"
ES_VERSION="2.4.1"

wget -q http://www-eu.apache.org/dist/cassandra/${CASSANDRA_VERSION}/apache-cassandra-${CASSANDRA_VERSION}-bin.tar.gz
tar xzf apache-cassandra-${CASSANDRA_VERSION}-bin.tar.gz

wget -q https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/tar/elasticsearch/${ES_VERSION}/elasticsearch-${ES_VERSION}.tar.gz
tar xzf elasticsearch-${ES_VERSION}.tar.gz


# Clone repository
cd ${CALIOPEN_BASE_DIR}
git clone https://git.sapienssapide.com/caliopen/monoRepo.git code

# Install python packages
cd ${CALIOPEN_BASE_DIR}/code/src/backend/main/py.storage
python setup.py develop
cd ${CALIOPEN_BASE_DIR}/code/src/backend/main/py.main
python setup.py develop
cd ${CALIOPEN_BASE_DIR}/code/src/backend/interfaces/REST/py.server
python setup.py develop

