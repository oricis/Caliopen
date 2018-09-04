#!/bin/bash
set -e

DEPS=""
# Find python requirement file
REQ_FILE=$(find $PROG -depth -type f -name requirements.deps)

# For every line in the file we search the dependency
while read -r line || [[ -n "$line" ]]; do
	DEP=`find src/backend -depth -type f,d -name $line | cut -d'/' -f 3- | tr '\n' ' '`
	DEPS="$DEPS $DEP"
done < $REQ_FILE
