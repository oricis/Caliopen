#!/bin/bash
set -e

if [ "$SRC_CHANGED" = "false" ];
then
	echo "No changes to backend"
	return
fi

# Respect GOPATH conventions and package imports
cp -r /srv/caliopen/src/backend/* /go/src/github.com/CaliOpen/Caliopen/src/backend
. devtools/drone/get_go_dependencies.sh

echo Testing the following dependencies: $DEPS

for dep in $DEPS;
do
	go test github.com/CaliOpen/Caliopen/src/backend/$dep/...
done
