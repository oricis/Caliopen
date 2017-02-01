#!/bin/bash

# Generate swagger sepcification from JSON schema definitions

set -ex
CALIOPEN_BASEDIR=$(pwd)/..

DEST_DIR=${CALIOPEN_BASEDIR}/doc/api
SRC_DIR=${CALIOPEN_BASEDIR}/src/backend/defs/rest-api

CMD="node ${DEST_DIR}/node_modules/swagger-cli/bin/swagger.js"

cd ${SRC_DIR}

${CMD} bundle -r swagger-root.json -o ${DEST_DIR}/swagger.json