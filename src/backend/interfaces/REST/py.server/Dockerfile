# This file creates a container that runs a {package} caliopen API
# Important:
# Author: Caliopen
# Date: 2015-10-18
FROM debian:jessie
MAINTAINER Caliopen
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y wget git python python-pip python-dev libffi-dev libssl-dev libev-dev libev4

# Debian jessie setuptools is a really old version (5.1.x)
# Install a really fresh version of setuptools
WORKDIR /tmp
RUN wget -q https://bootstrap.pypa.io/ez_setup.py
RUN python ez_setup.py

# Some package must be installed using pip and upgraded to latest
RUN pip install --upgrade pip
RUN pip install --upgrade pyasn1

# Clone into /srv/caliopen/code
WORKDIR /srv/caliopen
ADD https://github.com/CaliOpen/Caliopen/archive/master.tar.gz ./
RUN tar -xzf master.tar.gz && mv Caliopen-master code && rm master.tar.gz


# Install python backend packages in develop mode
WORKDIR /srv/caliopen/code/src/backend/main/py.storage
RUN python setup.py develop
WORKDIR /srv/caliopen/code/src/backend/main/py.main
RUN python setup.py develop

# Install API and doc
WORKDIR /srv/caliopen/code/src/backend/interfaces/REST/py.server
RUN python setup.py develop
WORKDIR /srv/caliopen/code/doc/py.doc
RUN python setup.py develop

EXPOSE 6543

CMD ["pserve", "/srv/caliopen/code/src/backend/configs/caliopen-api.docker.ini", "--reload"]
