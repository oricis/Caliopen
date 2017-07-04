#!/bin/bash
#
# DEVELOPMENT ONLY SCRIPT
#
# Clean docker containers and volumes where data are stored

docker-compose kill cassandra elasticsearch object_store
docker-compose rm -f cassandra elasticsearch object_store
docker volume rm devtools_db devtools_index devtools_store