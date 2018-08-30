#!/bin/bash
set -e

if [[ $SRC_CHANGED == "true" ]];
then
	echo "Building changes"
	#/usr/local/bin/dockerd-entrypoint.sh & >/dev/null 2>&1
	/bin/drone-docker
else
	echo "No changes to files, nothing to build"
	exit 0
fi
