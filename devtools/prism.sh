#!/bin/bash
PRISM_VERSION=v0.6.18
PROJECT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
API_PORT=31415
SWAGGER_FILE=$PROJECT_DIRECTORY/doc/api/swagger.json

set -e

if [ ! -f $PROJECT_DIRECTORY/prism_linux_amd64 ]; then
  wget -O  $PROJECT_DIRECTORY/prism_linux_amd64 https://github.com/stoplightio/prism/releases/download/$PRISM_VERSION/prism_linux_amd64
  chmod +x $PROJECT_DIRECTORY/prism_linux_amd64
fi

$PROJECT_DIRECTORY/prism_linux_amd64 run --mock --port $API_PORT --spec $SWAGGER_FILE

set +e
