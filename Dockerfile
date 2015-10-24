# This file creates a container that runs a {package} caliopen SMTP
# Important:
# Author: Caliopen
# Date: 2015-10-23

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


ADD . /srv/caliopen/smtp
WORKDIR /srv/caliopen/smtp/

# Copy configuration
ADD  https://raw.githubusercontent.com/CaliOpen/caliopen.base/master/caliopen.yaml.template caliopen.yaml

# Install the source in the /srv/caliopen/smtp
RUN pip install bcrypt
RUN pip install git+https://github.com/CaliOpen/caliopen.base.git
RUN pip install git+https://github.com/CaliOpen/caliopen.base.user.git
RUN pip install git+https://github.com/CaliOpen/caliopen.base.message.git
RUN pip install git+https://github.com/CaliOpen/caliopen.messaging.git
RUN pip install git+https://github.com/ekini/gsmtpd.git
RUN python setup.py develop

RUN useradd docker

RUN cp /srv/caliopen/smtp/docker/entrypoint.sh /docker-entrypoint.sh
RUN chmod 750  /docker-entrypoint.sh
RUN chown docker /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 25 465

CMD ["caliopen/smtp/bin/lmtpd.py", "-f", "caliopen.yaml"]
