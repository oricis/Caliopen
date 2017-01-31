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

# Install regex using pip as it fail using setup.py mechanisms
RUN pip install regex

# Install python backend packages in develop mode
WORKDIR /srv/caliopen/code/src/backend/main/py.storage
RUN python setup.py develop
WORKDIR /srv/caliopen/code/src/backend/main/py.main
RUN python setup.py develop

# Install Caliopen SMTP protocol, needed for CLI import command
WORKDIR /srv/caliopen/code/src/backend/protocols/py.smtp
RUN python setup.py develop

# Install Caliopen CLI

# Add local code to other base directory, local changes are seen
ADD . /srv/caliopen/py.CLI
WORKDIR /srv/caliopen/py.CLI
RUN python setup.py develop

# Copy configuration file
RUN cp /srv/caliopen/code/src/backend/configs/caliopen-docker.yaml /etc/caliopen.yaml

WORKDIR /srv/caliopen/code
ENTRYPOINT ["caliopen", "-f", "/etc/caliopen.yaml"]
