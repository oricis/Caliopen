#!/bin/bash
set -e

KUBE_DRIVER="none"
BACKEND_CONF_DIR=$(pwd | rev | cut -d'/' --complement -f1-2 | rev)"/src/backend/configs"

substitute_paths()
{
srcbackendpath=$(pwd | rev | cut -d'/' --complement -f1-2 | rev)"/src/backend"
devtoolsfixturespath=$(pwd | rev | cut -d'/' --complement -f1 | rev)"/fixtures"
echo
echo "Paths found:"
echo "------------"
echo $srcbackendpath
echo $devtoolsfixturespath

sed -i 's@\$\$SRCBACKEND@'"$srcbackendpath"'@' deployments/cli-admin-creation.yaml \
deployments/cli-setup.yaml deployments/cli-dev-creation.yaml \
deployments/cli-mail-import.yaml deployments/minio-deployment.yaml

sed -i 's@\$\$DEVTOOLSFIXTURES@'"$devtoolsfixturespath"'@' deployments/cli-mail-import.yaml
}

if [ "$EUID" -ne 0 ]
  then echo "Minikube needs to be run as root for local kubernetes deployment."
  exit
fi

#command -v vboxmanage >/dev/null 2>&1 || { echo "Virtualbox required but not installed. Aborting." >&2; exit 1; }
#command -v kubectl >/dev/null 2>&1 || { echo "Kubectl required but not installed. Aborting." >&2; exit 1; }
command -v minikube >/dev/null 2>&1 || { echo "Minikube required but not installed. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker required but not installed. Aborting." >&2; exit 1; }

minikube start --memory 6144 --cpus=2 --vm-driver=${KUBE_DRIVER}
read -p "Running elasticsearch needs modification of kernel parameter vm.max_map_count, confirm action.(y/n)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    sysctl -w vm.max_map_count=262144
else
	echo "You will need to manually modify vm.max_map_count to 262144 at least."
fi

echo
echo "Configmap creation"
echo "------------------"
kubectl create configmap caliopen-config --from-file=${BACKEND_CONF_DIR}


echo
echo "Service creation:"
echo "-----------------"
kubectl create -f ./services

echo
echo "Persistent storage creation:"
echo "----------------------------"
kubectl create  -f ./volumeclaims

substitute_paths

echo
echo "Basic deployments creation:"
echo "---------------------------"
kubectl create -f deployments/cassandra-deployment.yaml \
-f deployments/redis-deployment.yaml \
-f deployments/elasticsearch-deployment.yaml \
-f deployments/minio-deployment.yaml \
-f deployments/nats-deployment.yaml \
-f deployments/smtp-deployment.yaml

echo
echo "Waiting for pods to be available:"
echo "---------------------------"
while read line; do
	kubectl rollout status deployment ${line}
done < <(kubectl get deployments | awk 'FNR > 1 { print $1 }')



echo
echo "Setting up storage:"
echo "-------------------"
echo -n "Wait."
kubectl create -f deployments/cli-setup.yaml >/dev/null 2>&1
while [ $(kubectl get jobs | awk '/cli-setup/ { print $3 }') != "1" ]
do
	echo -n "."
	sleep 1
done

echo
echo "Creating admin:"
echo "---------------"
echo -n "Wait."
kubectl create -f deployments/cli-admin-creation.yaml >/dev/null 2>&1
while [ $(kubectl get jobs | awk '/cli-admin/ { print $3 }') != "1" ]
do
	echo -n "."
	sleep 1
done

echo
echo "Creating dev user:"
echo "------------------"
echo -n "Wait."
kubectl create -f deployments/cli-dev-creation.yaml >/dev/null 2>&1
while [ $(kubectl get jobs | awk '/cli-dev/ { print $3 }') != "1" ]
do
	echo -n "."
	sleep 1
done

echo
echo "Importing sample mail:"
echo "-----------------------------"
echo -n "Wait."
kubectl create -f deployments/cli-mail-import.yaml >/dev/null 2>&1
res=$(kubectl get pods | awk '/cli-import/ { print $3 }' | awk 'FNR == 1')
while [ $res != "Error" ] && [ $res != "Completed" ]
do
	echo -n "."
	sleep 1
	res=$(kubectl get pods | awk '/cli-import/ { print $3 }' | awk 'FNR == 1')
done

if [ $res == "Error" ]
then
	kubectl delete job cli-import
	echo "Error importing mails. Ignoring."
fi

echo
echo "Final deployments creation:"
echo "---------------------------"
kubectl create -f deployments/message-handler-deployment.yaml \
-f deployments/broker-deployment.yaml \
-f deployments/apiv1-deployment.yaml \
-f deployments/api-deployment.yaml \
-f deployments/frontend-deployment.yaml

echo
echo "Waiting for pods to be available:"
echo "---------------------------"
while read line; do
	kubectl rollout status deployment ${line}
done < <(kubectl get deployments | awk 'FNR > 1 { print $1 }')

echo
echo "List of available services:"
echo "------------------------------"
minikube service list