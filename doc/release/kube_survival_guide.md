Kubernetes Caliopen survival guide
==================================


Restart a service
-----------------

```
kubectl -n production get pod
# find pods running the service
kubectl -n production delete pod <pod_name>
```

View logs
---------

```
kubectl -n production logs --tail 200 -f deployment/<service>
```

Enter into a container
----------------------

currently go container does not have any shell, it's not possible. For others

```
kubectl exec -it <pod_name> /bin/sh
```

Restart a node
--------------

Steps :
~~~~~~~

- disable a node (drain)
- reboot the node
- restart the service
- reschedule the node (uncordon)

Commands
~~~~~~~~

1 - drain

```
$ kubectl drain <node> --ignore-daemonsets
$ kubectl get node
NAME      STATUS                     ROLES     AGE       VERSION
master    Ready                      master    190d      v1.13.2
node0     Ready                      <none>    190d      v1.13.2
node1     Ready,SchedulingDisabled   <none>    190d      v1.13.2
node2     Ready                      <none>    190d      v1.13.2
node3     Ready                      <none>    190d      v1.13.2

```

2 - reboot 
```
$ gandi vm reboot <node>
```

3 - restart service
# ssh root@<node>
$ service systemd-resolved start

# disable swap
swapoff -a
# start kubelet service
$ service kubelet restart
```

4 - reschedule

```
kubectl uncordon <node>
$ kubectl get node
NAME      STATUS    ROLES     AGE       VERSION
master    Ready     master    190d      v1.13.2
node0     Ready     <none>    190d      v1.13.2
node1     Ready     <none>    190d      v1.13.2
node2     Ready     <none>    190d      v1.13.2
node3     Ready     <none>    190d      v1.13.2

```
