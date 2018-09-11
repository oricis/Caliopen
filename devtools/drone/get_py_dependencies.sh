#!/bin/bash
set -e

DEPS=""
# Find python requirement file
REQ_FILE=$(find $BASE_DIR/$PROG -depth -type f -name requirements.deps)

# If the file does not exist or is empty we still have to set
# a value for DEPS so files_changed does not assume backend
if [ ! -s "$REQ_FILE" ];
then
	DEPS="none"
	return
fi

# For every line in the file we search the dependency
while read -r line || [[ -n "$line" ]]; do
	DEP=`find $BASE_DIR -depth \( -type f -o -type d \) -name $line | cut -d'/' -f 3- | tr '\n' ' '`
	DEPS="$DEPS $DEP"
done < $REQ_FILE
