## Local development using minikube

### Requirements

you need local resolution of service name used by munikube. Edit your /etc/hosts and add this line :

```
127.0.0.1	cassandra elasticsearch redis nats minio vault apiv1 api broker
```

### Go development

To start a local apiv2 server, you have to be in the correct directory to find all related configuration files

```sh
cd src/backend/configs
go run ../interfaces/REST/go.server/cmd/caliopen_rest/main.go serve -c apiv2
```

To start a local lmtp server, same location than for apiv2 and configuration files:

```sh
cd src/backend/configs
go run ../protocols/go.smtp/cmd/caliopen_lmtpd/main.go serve -c lmtp -p lmtp.pid
```

Same principle apply for `idpoller` and `imapworker`

### Python development

To start a local apiv1 server using pyramid pserve :

```sh
cd src/backend
pserve configs/apiv1.ini --reload
```

To start a local worker processing NATS messages:

```sh
cd src/backend/
python interfaces/NATS/py.client/caliopen_nats/listener.py -f configs/caliopen.yaml
```