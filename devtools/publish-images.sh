#!/bin/bash
set -e

APPS="apiv1 apiv2 cli frontend lmtpd mqworker identitypoller imapworker twitterworker"
STAGE=$1
VERSION="${CALIOPEN_VERSION}"
source ./registry.conf

if [[ ${STAGE} =~ ^(develop|master)$ ]]
then
	git checkout ${STAGE}
	for app in ${APPS}; do
		make ${STAGE} APP_NAME=$app
		if [[ $? -ne 0 ]]
		then
			echo "Fail to build and publish ${app}"
			exit $?
		fi
	done
else
	echo "Options are develop and master" 
	exit 1
fi
