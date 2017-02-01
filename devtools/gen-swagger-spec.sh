#!/bin/bash

# Generate swagger sepcification from JSON schema definitions

CALIOPEN_BASEDIR=$(pwd)/..

DEST_DIR=${CALIOPEN_BASEDIR}/doc/api
SRC_DIR=${CALIOPEN_BASEDIR}/src/backend/defs/rest-api

SWAGGER_JS="${DEST_DIR}/node_modules/swagger-cli/bin/swagger.js"
CMD="node ${SWAGGER_JS} bundle"


if [[ ! -f "${SWAGGER_JS}" ]]; then
	echo "You must install nodejs module swagger"
	echo "Run npm install swagger in ${DEST_DIR} directory"
	exit 1
fi


cd ${SRC_DIR}

${CMD} -r swagger-root.json -o ${DEST_DIR}/swagger.json