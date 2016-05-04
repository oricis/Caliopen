# This file creates a container that runs a {package} caliopen API
# Important:
# Author: Caliopen
# Date: 2015-10-18
FROM debian:jessie
MAINTAINER Caliopen
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y python python-dev python-pip git libffi-dev
# use a decent version
RUN pip install -U pip

# Version installed in Debian do not work !#@!@#!@#
RUN apt-get remove -y python-cffi

# Entrypoint
RUN useradd docker
COPY ./docker/entrypoint.sh /docker-entrypoint.sh
RUN chmod 750  /docker-entrypoint.sh
RUN chown docker /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# Dependencies
WORKDIR /srv/caliopen/
RUN pip install bcrypt
RUN pip install -e git+https://github.com/CaliOpen/caliopen.base.git#egg=caliopen.base
RUN pip install -e git+https://github.com/CaliOpen/caliopen.base.user.git#egg=caliopen.base.user
RUN pip install -e git+https://github.com/CaliOpen/caliopen.base.message.git#egg=caliopen.base.message
RUN pip install -e git+https://github.com/CaliOpen/caliopen.api.base.git#egg=caliopen.api.base
RUN pip install -e git+https://github.com/CaliOpen/caliopen.api.user.git#egg=caliopen.api.user
RUN pip install -e git+https://github.com/CaliOpen/caliopen.api.message.git#egg=caliopen.api.message

ADD . /srv/caliopen/api
WORKDIR /srv/caliopen/api/
RUN python setup.py develop

EXPOSE 6543

CMD ["pserve", "development.ini"]
