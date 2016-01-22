# This file creates a container that runs a {package} caliopen API
# Important:
# Author: Caliopen
# Date: 2015-01-12

FROM debian:jessie
MAINTAINER Caliopen
ENV DEBIAN_FRONTEND noninteractive


RUN apt-get update && apt-get upgrade -y && apt-get install -y locales
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8

RUN apt-get install -y python python-dev python-pip git libffi-dev
# use a decent version
RUN pip install -U pip

# Version installed in Debian do not work !#@!@#!@#
RUN apt-get remove -y python-cffi


ADD . /srv/caliopen/cli
WORKDIR /srv/caliopen/cli/

# Install the source in the /srv/caliopen/api
RUN pip install bcrypt
RUN pip install git+https://github.com/CaliOpen/caliopen.base.git
RUN pip install git+https://github.com/CaliOpen/caliopen.base.user.git
RUN pip install git+https://github.com/CaliOpen/caliopen.base.message.git
RUN pip install git+https://github.com/CaliOpen/caliopen.messaging.git
RUN pip install git+https://github.com/CaliOpen/caliopen.smtp.git
RUN python setup.py develop

RUN useradd docker

RUN cp /srv/caliopen/cli/docker/entrypoint.sh /docker-entrypoint.sh
RUN chmod 750  /docker-entrypoint.sh
RUN chown docker /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/bin/bash"]
