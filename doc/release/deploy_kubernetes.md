Deploy application
==================

Prepare
-------

# Make sure having credential for registry access

```
cd devtools
cp registry.conf.template registry.conf
vi registry.conf
```

#Note: It's excluded from git objects in .gitignore file.

# Sync your local master:
```
git checkout master
git pull --rebase master
```


# Define environment variables for version and application to deploy
```
export CALIOPEN_VERSION=X.Y.Z
export APP_NAME=<package>
```

# Tag the application:
```
cd devtools
./make_package make_version <package> ${CALIOPEN_VERSION}
```

Build and publish
-----------------

This will build the container related to the given application and publish it on the docker images registry using 2 tags:
- ${APP_NAME}/latest
- ${APP_NAME}/${CALIOPEN_VERSION}

```
cd devtools
make master
```

That's all (normally ;-))

Deploy on cluster
-----------------

# Connect to a node having a `kubectl` capability.

```
ssh root@bastion.cluster
```

# Edit the deployment and change the image version to use

```
kubectl get deployment
kubectl edit deployment <deployment_name>
```

Done.
