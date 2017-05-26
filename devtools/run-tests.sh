#!/bin/bash
set -ev

CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
PROJECT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

if [[ "${CURRENT_BRANCH}" == "master" ]]; then
    # IF something happen on master, test everything
    BACKEND_CHANGE="yes"
    FRONTEND_CHANGE="yes"
else
    BACKEND_CHANGE=`(cd $PROJECT_DIRECTORY && git diff-tree --no-commit-id --name-only -r HEAD..master src/backend)`
    FRONTEND_CHANGE=`(cd $PROJECT_DIRECTORY && git diff-tree --no-commit-id --name-only -r HEAD..master src/frontend)`
fi

function do_backend_tests {
    # Test build of go containers
    cd ${PROJECT_DIRECTORY}/devtools
    docker-compose build api broker
    # Python unittests
    export CALIOPEN_BASEDIR=${PROJECT_DIRECTORY}
    cd ${PROJECT_DIRECTORY}
    nosetests -sv src/backend/main/py.main/caliopen_main/tests
    # docker-compose run cli setup
    # docker-compose run cli create_user -e dev@caliopen.local -g John -f Doe -p blablabla
    # docker-compose run cli import -e dev@caliopen.local -f mbox -p /srv/caliopen/code/devtools/fixtures/mbox/dev@caliopen.local
}

function do_frontend_tests {
    (cd $PROJECT_DIRECTORY/src/frontend/web_application && yarn && yarn test)
}


if [[ "x${BACKEND_CHANGE}" != "x" ]]; then
    echo "##### Doing backend tests"
    do_backend_tests
fi

if [[ "x${FRONTEND_CHANGE}" != "x" ]]; then
    echo "##### Doing frontend tests"
    do_frontend_tests
fi
