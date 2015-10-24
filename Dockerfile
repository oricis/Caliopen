# This file creates a container that runs a {package} caliopen API
# Important:
# Author: Caliopen
# Date: 2015-10-18

FROM debian:jessie
MAINTAINER Caliopen
ENV DEBIAN_FRONTEND noninteractive


RUN apt-get update && apt-get upgrade -y && apt-get install -y locales
RUN locale-gen en_US.UTF-8  
ENV LANG en_US.UTF-8  

RUN apt-get install -y python python-dev python-pip git libffi-dev
RUN pip install -U pip     # use a decent version

# Version installed in Debian do not work !#@!@#!@#
RUN apt-get remove -y python-cffi


ADD . /srv/caliopen/api
WORKDIR /srv/caliopen/api/

# Install the source in the /srv/caliopen/api
RUN pip install bcrypt
RUN pip install git+https://github.com/CaliOpen/caliopen.base.git
RUN pip install git+https://github.com/CaliOpen/caliopen.base.user.git
RUN pip install git+https://github.com/CaliOpen/caliopen.base.message.git
RUN pip install git+https://github.com/CaliOpen/caliopen.api.base.git
RUN pip install git+https://github.com/CaliOpen/caliopen.api.user.git
RUN pip install git+https://github.com/CaliOpen/caliopen.api.message.git
RUN python setup.py develop

RUN useradd docker

RUN cp /srv/caliopen/api/docker/entrypoint.sh /docker-entrypoint.sh
RUN chmod 750  /docker-entrypoint.sh
RUN chown docker /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 6543
CMD ["pserve", "development.ini"]
