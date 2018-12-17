# Docker and Registry V2

## Dockerfiles

Dockerfiles for backend services are located in [src/backend][1] and for frontend services in [src/frontend/web_application][2]. Additionally, two other Dockerfiles are used for backend services, useful to reduce compilation time and for multi-stage builds:

* [Caliopen-go]: Go base image with govendor dependencies up to date
* [Caliopen-python]: Python base image with base packages and the cassandra driver installed

## Docker Registry

#### Public / Private registry

The Docker registry is exposed both publicly through https://public-registry.caliopen.org, to allow everybody to pull images, and privately (requiring authentication), so only members can push images.

#### Makefile and manual publishing

Although not especially useful considering Drone usually keeps both stable and unstable images up to date in the registry, there is a generic [Makefile](https://github.com/CaliOpen/Caliopen/blob/develop/devtools/makefile) to build and publish Caliopen images and a [script](https://github.com/CaliOpen/Caliopen/blob/develop/devtools/publish-images.sh) to build and publish every service with a given tag. Note that to publish images with the script you need to have the registry credentials defined in a registry.conf file in the same directory. Usage:

```
./publish-images <tag>
```

Currently the docker-compose file is used to build the images. Ideally, this should be changed to ```docker build``` commands.

#### Getting a list of images and tags available

* You can get a list of the available images with an HTTP GET request to https://public-registry.caliopen.org/v2/_catalog
* To get a list of the tags available for an image make the request to https://public-registry.caliopen.org/v2/X/tags/list where X is the name of the image you want to get the list of tags for.

A simpler and prettier way to do it is with a tool such as [registry-cli](https://github.com/andrey-pohilko/registry-cli).

#### Cleaning image layers to reduce disk usage

The aforementioned tool also allows the deletion of images. Note that this does not actually delete the images, it only marks them for deletion, so the garbage collector can later delete them. For our registry the garbage collector runs once a week through a cronjob but it can also be manually ran. The environment variable REGISTRY_STORAGE_DELETE_ENABLED has to be set to "true" for the deletion to work, inside the docker-compose file of the registry for example.

#### Integration with Drone

As previously mentioned, Drone automatically build and publishes stable and unstable versions of the images to the registry.

[1]: https://github.com/CaliOpen/Caliopen/tree/develop/src/backend
[2]: https://github.com/CaliOpen/Caliopen/tree/develop/src/frontend/web_application
