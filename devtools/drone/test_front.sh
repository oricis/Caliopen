#!/bin/bash
set -e    

if [ "$SRC_CHANGED" = "false" ];
then
	echo "No changes to frontend"
	return
fi

cd src/frontend/web_application
yarn
# In the future Selenium tests can be done locally or with Drone services
if [[ $LOCAL_TEST == "true" ]];then
	yarn test:e2e:init	
fi
yarn test
