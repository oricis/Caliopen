FROM debian:wheezy

RUN apt-get update

# Install python
RUN     apt-get install -y \
      python2.7 \
      python-setuptools \
      python-dev \
      python-pip \
      libffi-dev \
      git

# Import python app
## Prepare ssh environment
ADD . /srv/caliopen.smtp


WORKDIR /srv/caliopen.smtp

# Copy configuration
COPY caliopen.yaml.template caliopen.yaml

VOLUME ['/srv/caliopen.smtp']


# Install caliopen dependencies
RUN     pip install -U pip     # use a decent version
RUN pip install git+https://github.com/Caliopen/caliopen.base.git
RUN pip install git+https://github.com/Caliopen/caliopen.base.user.git
RUN pip install git+https://github.com/Caliopen/caliopen.base.message.git
RUN pip install git+https://github.com/Caliopen/caliopen.messaging.git

# Install
RUN     python setup.py install
RUN     python setup.py develop

# install development extra
RUN     pip install -e ".[dev]"  # installed development tools if any

RUN     useradd docker

EXPOSE 25 465


CMD [ "lmtpd.py", "caliopen.yaml" ]
