# Release

Things to do for a new release...

## 1. Prepare

* Merge all the things in `master` branch
  ```
  git checkout develop && git pull
  git checkout master && git pull
  git merge develop
  ```
* Make sure `CHANGELOG.md` is up to date according to http://keepachangelog.com
* Stash or commit if you have changes
* Change the version of caliopen packages (python and virtualenv are required):
  ```
  cd devtools
  # or you can use `setup-virtualenv.sh`
  virtualenv --python=python2.7 ./.venv
  source .venv/bin/activate
  pip install -r ./manage_package-requirements.txt
  ./manage_package --help
  # change in the following the package name you want (refer to packages.yaml e.g "client", etc. or all) and the version
  ./manage_package --conf ./packages.yaml create_version all 0.18.1
  deactivate
  ```

## 2. Build packages

## 3. Publish

## 4. [Communicate](./Communication.md)
