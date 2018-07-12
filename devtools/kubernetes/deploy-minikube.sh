#!/bin/bash
set -e

OS=$(uname -s)
KUBE_DRIVER="none"
BACKEND_CONF_DIR="../../src/backend/configs"
MINIO_CONF_DIR=${BACKEND_CONF_DIR}"/minio"
SKIP_SETUP=$1

wait_for_pods(){
	echo
	echo "Waiting for pods to be available:"
	echo "---------------------------"
	while read line; do
		kubectl rollout status deployment ${line}
	done < <(kubectl get deployments | awk 'FNR > 1 { print $1 }')
}

#For OS other than Linux, use Virtualbox
check_os(){
	if [[ ${OS} != 'Linux' ]]
	then
		KUBE_DRIVER="virtualbox"
	else
		while true; do
		    read -p "On Linux Minikube can be run on Virtualbox or locally with Docker, which one should be used? (v/d) " dv
		    case ${dv} in
		        [Dd]* ) break;;
		        [Vv]* ) KUBE_DRIVER="virtualbox"; break;;
		        * ) echo "Please answer Docker(d) or Virtualbox(v).";;
		    esac
		done
	fi
}

#If the user is running the stack with virtualbox he does not need root
check_driver_and_root(){
	if [[ ${KUBE_DRIVER} = "virtualbox" ]]
	then
		command -v vboxmanage >/dev/null 2>&1 || { echo "Virtualbox required but not installed. Aborting." >&2; exit 1; }
		if [ "$EUID" -eq 0 ]
		then
			echo "  ---------------------------------------------------------------------"
			echo "  Minikube doesn't need to be run as root to deploy Kubernetes on a VM."
			echo "  ---------------------------------------------------------------------"
		fi
	else
		command -v docker >/dev/null 2>&1 || { echo "Docker required but not installed. Aborting." >&2; exit 1; }
		if [ "$EUID" -ne 0 ]
		then
			echo "Minikube needs to be run as root for local kubernetes deployment."
			exit 1
		fi
	fi
}

#Check vm/max_map_count value for elasticsearch
check_es(){
	if [[ ${KUBE_DRIVER} = "none" ]]
	then
		if [[  $(sysctl -n vm.max_map_count) -lt 262144 ]]
		then
			while true; do
			    read -p "Running elasticsearch needs modification of kernel parameter vm.max_map_count, confirm action.(y/n) " yn
			    case ${yn} in
			        [Yy]* ) sysctl -w vm.max_map_count=262144; break;;
			        [Nn]* ) echo "You will need to manually modify vm.max_map_count to 262144 at least."; break;;
			        * ) echo "Please answer yes(y) or no(n).";;
			    esac
			done
		fi
	else
		minikube ssh "sudo sysctl -w vm.max_map_count=262144"
	fi
}

create_configmaps(){
	echo
	echo "Configmap and secret creation"
	echo "-----------------------------"
	kubectl create configmap caliopen-config --from-file=${BACKEND_CONF_DIR}
	kubectl create configmap minio-config --from-file=${MINIO_CONF_DIR}
	kubectl apply -f configs/dns-config.yaml
}

create_services(){
	echo
	echo "Service creation:"
	echo "-----------------"
	kubectl apply -f services/cassandra-service.yaml \
	-f services/elasticsearch-service.yaml \
	-f services/external-go-service.yaml \
	-f services/external-python-service.yaml \
	-f services/minio-service.yaml \
	-f services/nats-service.yaml \
	-f services/redis-service.yaml \
	-f services/smtp-service.yaml
}

create_pvc(){
	echo
	echo "Persistent storage creation:"
	echo "----------------------------"
	kubectl apply  -f ./volumeclaims
}

create_basic_deployments(){
	echo
	echo "Basic deployments creation:"
	echo "---------------------------"
	kubectl apply -f deployments/cassandra-deployment.yaml \
	-f deployments/redis-deployment.yaml \
	-f deployments/elasticsearch-deployment.yaml \
	-f deployments/minio-deployment.yaml \
	-f deployments/nats-deployment.yaml \
	-f deployments/smtp-deployment.yaml
}

setup_storage(){
	echo
	echo "Setting up storage:"
	echo "-------------------"
	echo -n "Wait."
	kubectl create -f jobs/cli-setup.yaml >/dev/null 2>&1
	while [ $(kubectl get jobs | awk '/cli-setup/ { print $3 }') != "1" ]
	do
		echo -n "."
		sleep 1
	done
	kubectl delete -f jobs/cli-setup.yaml >/dev/null 2>&1
}

create_admin_user(){
	echo
	echo "Creating admin:"
	echo "---------------"
	echo -n "Wait."
	kubectl create -f jobs/cli-admin-creation.yaml > /dev/null 2>&1
	while [ $(kubectl get jobs | awk '/cli-admin/ { print $3 }') != "1" ]
	do
		echo -n "."
		sleep 1
	done
}

create_dev_user(){
	echo
	echo "Creating dev user:"
	echo "------------------"
	echo -n "Wait."
	kubectl create -f jobs/cli-dev-creation.yaml >/dev/null 2>&1
	while [ $(kubectl get jobs | awk '/cli-dev/ { print $3 }') != "1" ]
	do
		echo -n "."
		sleep 1
	done
}

#Importing mail has failed in the past, to make sure it does not get stuck we delete in case of error
import_mail(){
	echo
	echo "Importing sample mail:"
	echo "-----------------------------"
	echo -n "Wait."
	kubectl create -f jobs/cli-mail-import.yaml >/dev/null 2>&1
	res=$(kubectl get pods | awk '/cli-import/ { print $3 }' | awk 'FNR == 1')
	while [ ${res} != "Error" ] && [ ${res} != "Completed" ]
	do
		echo -n "."
		sleep 1
		res=$(kubectl get pods | awk '/cli-import/ { print $3 }' | awk 'FNR == 1')
	done
	if [ ${res} == "Error" ]
	then
		echo "Error importing mails. Ignoring."
	fi
	kubectl delete -f jobs/cli-mail-import.yaml >/dev/null 2>&1
}

create_go_deployments(){
	echo
	echo "GO applications deployment:"
	echo "---------------------------"
	kubectl delete svc api broker
	kubectl apply -f services/api-service.yaml \
	-f services/broker-service.yaml
	kubectl apply -f deployments/broker-deployment.yaml \
	-f deployments/api-deployment.yaml \
	-f deployments/identity-poller-deployment.yaml \
	-f deployments/identity-worker-deployment.yaml
}

create_python_deployments(){
	echo
	echo "Python applications deployment:"
	echo "---------------------------"
	kubectl delete svc apiv1
	kubectl apply -f services/apiv1-service.yaml
	kubectl apply -f deployments/message-handler-deployment.yaml \
	-f deployments/apiv1-deployment.yaml
}

create_frontend_deployment(){
	echo
	echo "Web Client deployment:"
	echo "---------------------------"
	kubectl apply -f services/frontend-service.yaml
	kubectl apply -f deployments/frontend-deployment.yaml

}

conditional_deployment(){
while true; do
	echo
    read -p "Is this deployment for ${1} development? (y/n) " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) ${2}; break;;
        * ) echo "Please answer Yes(y) or No(n).";;
    esac
done
}

chown_kube_minikube_directories(){
#This allows the user to use kubectl without sudo
if [[ ${KUBE_DRIVER} = "none" ]]
then
	chown -R ${SUDO_USER} $HOME/.kube
	chgrp -R ${SUDO_USER} $HOME/.kube

	chown -R ${SUDO_USER} $HOME/.minikube
	chgrp -R ${SUDO_USER} $HOME/.minikube
fi
}

############################################################
if [[ $SKIP_SETUP != "skip-setup" ]]
then
	command -v minikube >/dev/null 2>&1 || { echo "Minikube required but not installed. Aborting." >&2; exit 1; }

	check_os
	check_driver_and_root
	minikube start --memory 6144 --cpus=2 --vm-driver=${KUBE_DRIVER} --extra-config=apiserver.service-node-port-range=1-35000
	#--dns-domain=dev.caliopen.org NOT WORKING
	# --apiserver-ips 127.0.0.1 --apiserver-name localhost
	# nodePortAddresses: [127.0.0.0/8] on kube-proxy configmap TO LIMIT EXTERNAL ACCESS
	check_es
	create_configmaps
fi
create_services
create_pvc
create_basic_deployments
#Wait for storage to be ready
wait_for_pods
setup_storage
create_admin_user || true
create_dev_user || true
import_mail
conditional_deployment "GO" "create_go_deployments"
conditional_deployment "Python" "create_python_deployments"
conditional_deployment "Frontend" "create_frontend_deployment"
#Wait for Webclient to be available
wait_for_pods

echo
echo "List of available services:"
echo 
minikube service list
chown_kube_minikube_directories
