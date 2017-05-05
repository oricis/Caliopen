#!/bin/csh
#boostrap a freebsd with a POC and a postfix

set CASSANDRA_VERSION="2.2.9"
set ELASTICSEARCH_VERSION="2.4.4"

set CALIOPEN_BASE_DIR="/usr/local/caliopen"
set GOPATH="/usr/local/goland"
set CALIOPEN_REPO_DIR="${GOPATH}/src/github.com/CaliOpen"
set CALIOPEN_BACKEND_DIR="${CALIOPEN_REPO_DIR}/Caliopen/src/backend"
set CALIOPEN_FRONTEND_DIR="${CALIOPEN_REPO_DIR}/Caliopen/src/frontend/web_application"
set CONF_DIR="${CALIOPEN_BACKEND_DIR}/configs"
set CONF_FILE="${CONF_DIR}/caliopen.yaml.template"

# System setup
touch /etc/rc.conf
# hostname
echo "hostname" >> /etc/rc.conf
pkg update
pkg upgrade -y

# Get utils
pkg install -y git

# Install GOlang environment
pkg install -y lang/go
setenv GOPATH ${GOPATH}
[[ -d ${GOPATH} ]] || mkdir -p ${GOPATH}
echo 'setenv GOPATH ${GOPATH}' >> ~/.cshrc
cd ${GOPATH}
mkdir bin pkg src
setenv PATH "${PATH}:/usr/local/go/bin:${GOPATH}/bin"
echo 'setenv PATH "${PATH}:/usr/local/go/bin:${GOPATH}/bin"' >> ~/.cshrc
# Install go vendoring manager
go get -u github.com/kardianos/govendor

