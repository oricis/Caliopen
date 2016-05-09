# This file creates a container that runs a {package} caliopen SMTP
# Important:
# Author: Caliopen
# Date: 2015-10-23
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
RUN pip install -e git+https://github.com/CaliOpen/caliopen.messaging.git#egg=caliopen.messaging
RUN pip install git+https://github.com/ekini/gsmtpd.git

# Codebase
ADD . /srv/caliopen/smtp
WORKDIR /srv/caliopen/smtp/
RUN python setup.py develop

# caliopen.smtp configuration
RUN ln -s /srv/caliopen/src/caliopen.base/caliopen.yaml.template /caliopen.yaml

# postfix installation (can be moved to an other container)
RUN apt-get --no-install-recommends install rsyslog --yes --force-yes
RUN apt-get install postfix --yes --force-yes

# Expose
ENV CALIOPEN_VIRTUAL_MAILBOX_DOMAINS mail.example.tld
EXPOSE 25 465 4000
VOLUME /var/spool/postfix

CMD ["docker/start-server.sh"]
