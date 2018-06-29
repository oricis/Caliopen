#!/bin/bash
set -e

APPS="api apiv1 cli frontend broker message_handler identity_worker identity_poller"
STAGE=$1
VERSION="${CALIOPEN_VERSION}"
source ./registry.conf

if [[ ${STAGE} =~ ^(develop|master)$ ]]
then
	git checkout ${STAGE}
	for app in ${APPS}; do
		make ${STAGE} APP_NAME=$app
	done	
else
	echo "Options are develop and master" 
	exit 1
fi
