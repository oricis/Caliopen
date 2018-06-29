#SET THIS VARIABLE TO DEFINE WHICH APP YOU WANT TO PUBLISH
#APP_NAME=
VERSION := ${CALIOPEN_VERSION}
CONF ?= registry.conf
include $(CONF)
# HELP
# This will output the help for each task
# Based on https://gist.github.com/mpneuried/0594963ad38e68917ef189b4e6a269db
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## Show help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

# DOCKER TASKS
build: ## Build the image
	docker-compose build $(APP_NAME)

build-nc: ## Build the image without caching
	docker-compose build --no-cache $(APP_NAME)

# Master images
master: build repo-login publish-latest publish-version ## Publish the `{version}`,`latest` tagged image

publish-latest: tag-latest ## Publish the `latest` tagged image
	@echo 'publish latest to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(APP_NAME):latest

publish-version: tag-version ## Publish the `{version}` tagged image
	@echo 'publish $(VERSION) to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(APP_NAME):$(VERSION)

tag-latest: ## Generate image `app`:latest
	@echo 'create tag latest'
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):latest

tag-version: ## Generate image `app`:`{version}`
	@echo 'create tag $(VERSION)'
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):$(VERSION)

# Develop images
develop: build repo-login publish-develop ## Build and publish the `develop` tagged images

publish-develop: tag-develop ## Publish the `develop` tagged image
	@echo 'publish develop to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(APP_NAME):develop

tag-develop: ## Generate image with `develop` tag
	@echo 'create tag develop'
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):develop
# HELPERS

# generate script to login to docker registry
CMD_REPOLOGIN := "docker login -u=$(REPO_USER) -p=$(REPO_PASS) $(DOCKER_REPO)"

# login to registry
repo-login: ## Auto login
	@eval $(CMD_REPOLOGIN)

version: ## Output the current version
	@echo $(VERSION)
