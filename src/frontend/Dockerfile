# This file creates a container that runs a {package} caliopen frontend
# Important:
# Author: Caliopen
# Date: 2016-01-05

FROM node:6
MAINTAINER Caliopen

# Clone into /srv/caliopen/code
WORKDIR /srv/caliopen
ADD https://github.com/CaliOpen/Caliopen/archive/master.tar.gz ./
RUN tar -xzf master.tar.gz && mv Caliopen-master code && rm master.tar.gz
#ADD . /srv/caliopen/code/src/frontend/

WORKDIR /srv/caliopen/code/src/frontend/web_application
RUN yarn install
RUN yarn run release

# VOLUME /srv/caliopen/code/src/frontend/web_application
EXPOSE 4000

CMD ["yarn", "run", "start:prod"]
