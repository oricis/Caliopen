#!/bin/bash
set -e

DEPS=""
REQ_FILES=$(find src/backend -depth -type f -name requirements.deps)

for file in $REQ_FILES;do
	while read -r line || [[ -n "$line" ]]; do
		DEP=`find src/backend -depth -type f,d -name $line | cut -d'/' -f 3- | tr '\n' ' '`
		DEPS="$DEPS $DEP"
	done < $file
done
