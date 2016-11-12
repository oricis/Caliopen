#!/bin/bash
CALIOPEN_BASE_DIR="/opt/caliopen"
CASSANDRA_VERSION="2.2.8"

# Install system packages
apt-get -y update
apt-get -y upgrade
apt-get install -y git libffi-dev python-pip gcc python-dev libssl-dev libev4 libev-dev redis-server elasticsearch

# Debian jessie setuptools is a really old version (5.1.x)
# Install a really fresh version of setuptools
wget -q https://bootstrap.pypa.io/ez_setup.py
python ez_setup.py

# Some package must be installed using pip and upgraded to latest
pip install --upgrade pip
pip install --upgrade pyasn1


# Create CaliOpen work directory
mkdir ${CALIOPEN_BASE_DIR}

# Install storage engines
mkdir ${CALIOPEN_BASE_DIR}/ext && cd $_

wget -q http://www-eu.apache.org/dist/cassandra/${CASSANDRA_VERSION}/apache-cassandra-${CASSANDRA_VERSION}-bin.tar.gz
tar xzf apache-cassandra-${CASSANDRA_VERSION}-bin.tar.gz


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

# Start services
cd ${CALIOPEN_BASE_DIR}/ext/apache-cassandra-${CASSANDRA_VERSION}
sed -i -e '/#MAX_HEAP_SIZE=/ s/.*/MAX_HEAP_SIZE="1G"/' conf/cassandra-env.sh
sed -i -e '/#HEAP_NEWSIZE=/ s/.*/HEAP_NEWSIZE="512M"/' conf/cassandra-env.sh
./bin/cassandra

sed -i -e '/#START_DAEMON=true/ s/.*/START_DAEMON=true/' /etc/default/elasticsearch
/etc/init.d/elasticsearch stop
/etc/init.d/elasticsearch start

cd ${CALIOPEN_BASE_DIR}/code/src/backend/interfaces/REST/py.server
pserve --daemon development.ini
