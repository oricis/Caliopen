# Install dev env using minikube

## Pre-requisites

* If you are **NOT** running Linux, you need to install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
* If you are running Linux, you can **either**:
	* Use VirtualBox 
	* Run the stack locally with [Docker](https://docs.docker.com/install/).
* [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) & [Minikube](https://github.com/kubernetes/minikube/releases)
* git-crypt (eventually via your distribution package manager) to be able to pull images from our registry


## WARNING

Before starting the installation, make sure to read this carefully.

There is currently a bug with the Kubernetes dashboard **when running the stack locally with docker**: if you change networks while Kubernetes is running it might go into a crash loop and use 100% of your cpu after some time. To fix that you can manually delete the pod so that it is recreated:

```sh
kubectl delete pod kubernetes-dashboard-ID

```

You can find your pod's ID with:

```sh
kubectl get pods --namespace kube-system
```

You can also disable and re-enable the dashboard addon with minikube:

```
minikube addons [ disable | enable ] dashboard
```

Make sure to stop minikube before going offline to avoid any problems.

## Deployment

After cloning the project, use git-crypt to unlock secret files, note that you have to be added as a collaborator in the project to do so.

> **FIXME:** _*Pulling images from the registry should be allowed without authentication so we do not actually need git-crypt for contributors.*_

```sh
git-crypt unlock
```
Then start the deployment:

```
./deploy-minikube.sh
```

###### During the installation:

You can select for which kind of development your deployment is:

* Go
* Python
* Frontend

 You can individually select them. Based on your choices some services are not deployed so that you can plug in your local development environment.

>_For example, you want to do some frontend development, answer [y] for that choice only, then refer to [frontend native installation](./FIXME)._

##### NOTE:

To deploy the stack with docker you'll need to run the script as sudo. See [kubernetes/kubeadm#57](https://github.com/kubernetes/kubeadm/issues/57).


## Deleting deployment 

In case you are deploying the stack without a driver (locally) and the command fails or if you just want to restart the deployment, clean the stack beforehand:

```sh
sudo ./clean-minikube.sh
```

##### NOTE:

This command resets kubeadm, so be careful if you have any other kubernetes configs on your machine.

## Usage

_**Starting the cluster:**_

```sudo minikube start```

_**Stopping the cluster:**_

```minikube stop```

## Additional info

* [**Kubectl**](https://kubernetes.io/docs/reference/kubectl/overview/)
* [**Minikube**](https://github.com/kubernetes/minikube)
