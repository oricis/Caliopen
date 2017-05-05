#!/bin/bash
#boostrap a debian with a POC and a postfix
#no service is running, but all components should be correctly installed, configured and ready to start.

set -ev

CASSANDRA_VERSION="2.2.9"
ELASTICSEARCH_VERSION="2.4.4"
GO_VERSION="1.8.1"

CALIOPEN_BASE_DIR="/opt/caliopen"
GOPATH="/opt/go"
GO_PKG="go${GO_VERSION}.linux-amd64.tar.gz"
CALIOPEN_REPO_DIR="${GOPATH}/src/github.com/CaliOpen"
CALIOPEN_BACKEND_DIR="${CALIOPEN_REPO_DIR}/Caliopen/src/backend"
CALIOPEN_FRONTEND_DIR="${CALIOPEN_REPO_DIR}/Caliopen/src/frontend/web_application"
CONF_DIR="${CALIOPEN_BACKEND_DIR}/configs"
CONF_FILE="${CONF_DIR}/caliopen.yaml.template"

# Install system packages
apt-get -y update
apt-get -y upgrade
apt-get install -y libffi-dev gcc libssl-dev libev4 libev-dev
apt-get install -y apt-transport-https
apt-get install -y wget curl git unzip

# Install GOlang environment
[[ -d ${GOPATH} ]] || mkdir ${GOPATH}
export GOPATH=${GOPATH}
echo 'export GOPATH="${GOPATH}"' >> ~/.bashrc
cd ${GOPATH}
wget -q https://storage.googleapis.com/golang/${GO_PKG}
tar -C /usr/local -xzf ${GO_PKG}
mkdir bin pkg src
export PATH=${PATH}:/usr/local/go/bin:${GOPATH}/bin
echo 'export PATH="$PATH:/usr/local/go/bin:$GOPATH/bin"' >> ~/.bashrc
# Install go vendoring manager
go get -u github.com/kardianos/govendor

# Setup python environment
apt-get install -y python-pip python-dev
cd ${CALIOPEN_BASE_DIR}
wget -q https://bootstrap.pypa.io/ez_setup.py
python ez_setup.py
pip install --upgrade pip

# install js environment
wget -q https://deb.nodesource.com/setup_6.x -O -|bash
apt-get install -y nodejs
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
apt-get install yarn

# Create CaliOpen work directory
[[ -d "${CALIOPEN_BASE_DIR}/ext" ]] || mkdir -p ${CALIOPEN_BASE_DIR}/ext

# Install storage engine
#cassandra
cd ${CALIOPEN_BASE_DIR}/ext
wget -q http://www-eu.apache.org/dist/cassandra/${CASSANDRA_VERSION}/apache-cassandra-${CASSANDRA_VERSION}-bin.tar.gz
tar xzf apache-cassandra-${CASSANDRA_VERSION}-bin.tar.gz
cd apache-cassandra-${CASSANDRA_VERSION}
sed -i -e '/#MAX_HEAP_SIZE=/ s/.*/MAX_HEAP_SIZE="1G"/' conf/cassandra-env.sh
sed -i -e '/#HEAP_NEWSIZE=/ s/.*/HEAP_NEWSIZE="512M"/' conf/cassandra-env.sh
#redis
apt-get install -y redis-server
#elasticsearch
cd ${CALIOPEN_BASE_DIR}/ext
curl -L -O https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/tar/elasticsearch/${ELASTICSEARCH_VERSION}/elasticsearch-${ELASTICSEARCH_VERSION}.tar.gz
tar -xvf elastisearch-${ELASTICSEARCH_VERSION}.tar.gz

# Install NATS messaging service
go get github.com/nats-io/gnatsd

# Clone Caliopen repo into GOPATH tree
mkdir -p ${CALIOPEN_REPO_DIR}
cd ${CALIOPEN_REPO_DIR}
git clone https://github.com/CaliOpen/Caliopen.git

# could checkout a specific branch at this stage
# git checkout ${BRANCH_NAME}

# Install Caliopen python packages
pip install --upgrade pyasn1
pip install --upgrade rfc3987

cd ${CALIOPEN_BACKEND_DIR}/main/py.storage
python setup.py develop
cd ${CALIOPEN_BACKEND_DIR}/main/py.main
python setup.py develop
cd ${CALIOPEN_BACKEND_DIR}/interfaces/REST/py.server
python setup.py develop
cd ${CALIOPEN_BACKEND_DIR}/interfaces/NATS/py.client
python setup.py develop
cd ${CALIOPEN_BACKEND_DIR}/tools/py.CLI
python setup.py develop
cd ${CALIOPEN_REPO_DIR}/Caliopen/doc/py.doc
python setup.py develop

# Install Caliopen Go binaries
cd ${CALIOPEN_BACKEND_DIR}
govendor sync
go install ${CALIOPEN_BACKEND_DIR}/protocols/go.smtp/cmd/caliopen_lmtpd
go install ${CALIOPEN_BACKEND_DIR}/interfaces/REST/go.server/cmd/caliopen_rest

# Install front client
cd ${CALIOPEN_FRONTEND_DIR}
yarn install
yarn run release

### Caliopen stack is installed at this stage ###

## Ignition starting
# Start store services
cd ${CALIOPEN_BASE_DIR}/ext/apache-cassandra-${CASSANDRA_VERSION}/bin
export CQLENG_ALLOW_SCHEMA_MANAGEMENT="true"
./cassandra
#wait for cassandra warming-up
sleep 10
/etc/init.d/redis start
cd ${CALIOPEN_BASE_DIR}/ext/elastisearch-${ELASTICSEARCH_VERSION}/bin
./elasticsearch

# Start NATS service
gntasd &

# Setup caliopen database (should run only once)
caliopen -f ${CONF_FILE} setup
# Create first account and fill it with fixtures (should run only once)
caliopen -f ${CONF_FILE} create_user -e dev -g John -f Dœuf -p 123456
caliopen -f ${CONF_FILE} import -e dev@caliopen.local -f mbox -p ${CALIOPEN_BASE_DIR}/code/devtools/fixtures/mbox/dev@caliopen.local

# start caliopen APIs
caliopen_rest serve -c ${CONF_DIR}/caliopen-go-api_dev
cd ${CALIOPEN_BACKEND_DIR}/main
./startup &
cd ${CALIOPEN_BACKEND_DIR}/interfaces/NATS/py.client/caliopen_nats
python listener.py -f ${CONF_FILE} &

# start email broker service
caliopen_lmtp serve -c ${CONF_DIR}/caliopen-go-lmtp_dev

# Start client
cd ${CALIOPEN_FRONTEND_DIR}
yarn run start:prod
