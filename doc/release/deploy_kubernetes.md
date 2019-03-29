Deploy application
==================

For cluster basic operational commands, there is a [survival guide](../devops/kube_survival_guide.md)

Deploy on cluster
-----------------

```
# Connect to a node having a `kubectl` capability.
ssh root@bastion.cluster

# Edit the deployment and change the image version to use
kubectl get deployment
kubectl edit deployment <deployment_name>

# Then find section container:image in yaml file and replace version number.
# Something like: public-registry.caliopen.org/${APP_NAME}:${CALIOPEN_VERSION}

```

Done.
