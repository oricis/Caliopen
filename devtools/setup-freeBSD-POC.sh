#!/bin/csh
#boostrap a freebsd with a POC and a postfix
set -ev

CASSANDRA_VERSION="2.2.9"
ELASTICSEARCH_VERSION="2.4.4"
GO_VERSION="1.8.1"

CALIOPEN_BASE_DIR="/home/caliopen"
GOPATH="/usr/local/goland"
GO_PKG="go${GO_VERSION}.free-bsd.tar.gz"
CALIOPEN_REPO_DIR="${GOPATH}/src/github.com/CaliOpen"
CALIOPEN_BACKEND_DIR="${CALIOPEN_REPO_DIR}/Caliopen/src/backend"
CALIOPEN_FRONTEND_DIR="${CALIOPEN_REPO_DIR}/Caliopen/src/frontend/web_application"
CONF_DIR="${CALIOPEN_BACKEND_DIR}/configs"
CONF_FILE="${CONF_DIR}/caliopen.yaml.template"

# System setup
touch /etc/rc.conf
# hostname
echo "hostname" >> /etc/rc.conf
pkg update
pkg upgrade -y


# Install GOlang environment
pkg install -y lang/go
setenv GOPATH ${GOPATH}
[[ -d ${GOPATH} ]] || mkdir -p ${GOPATH}
echo 'setenv GOPATH ${GOPATH}' >> ~/.cshrc
cd ${GOPATH}
mkdir bin pkg src
setenv PATH "$PATH:/usr/local/go/bin:${GOPATH}/bin"
echo 'export PATH="$PATH:/usr/local/go/bin:$GOPATH/bin"' >> ~/.bashrc
# Install go vendoring manager
go get -u github.com/kardianos/govendor

