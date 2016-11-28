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
RUN git clone https://github.com/CaliOpen/Caliopen.git code

# Install python backend packages in develop mode
WORKDIR /srv/caliopen/code/src/backend/main/py.storage
RUN python setup.py develop
WORKDIR /srv/caliopen/code/src/backend/main/py.main
RUN python setup.py develop

# Install Caliopen SMTP protocol, needed for CLI import command
WORKDIR /srv/caliopen/code/src/backend/protocols/py.smtp
RUN python setup.py develop

# Install Caliopen CLI
WORKDIR /srv/caliopen/code/src/backend/tools/py.CLI
RUN python setup.py develop
