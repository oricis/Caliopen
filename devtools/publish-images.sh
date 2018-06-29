#!/bin/bash
set -e

APPS="api apiv1 cli frontend broker message_handler identity_worker identity_poller"
STAGE=$1
DOCKER_REPO="registry.caliopen.org"
REPO_USER=""
REPO_PASS=""
VERSION="${CALIOPEN_VERSION}"

if [[ ${STAGE} =~ ^(develop|master)$ ]]
then
	git checkout ${STAGE}
	for app in ${APPS}; do
		make ${STAGE} APP_NAME=$app DOCKER_REPO=$DOCKER_REPO REPO_USER=$REPO_USER REPO_PASS=$REPO_PASS VERSION=$VERSION
	done	
else
	echo "Options are develop and master" 
	exit 1
fi
