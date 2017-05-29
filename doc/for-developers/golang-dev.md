# Go development for CaliOpen

As Caliopen use a mono repository structure and use many languages,
the setup for a go development environment need some specific considerations.

## A specific GOPATH is privilegied

We use [govendor](https://github.com/kardianos/govendor) for external dependencies
it's better to have a specific GOPATH to develop on Caliopen.

```
mkdir $HOME/caliopen
cd $HOME/caliopen
for i in bin pkg src src/github.com src/github.com/CaliOpen
do
	mkdir caliopen/$i
done
export GOPATH=$HOME/caliopen

cd src/github.com/CaliOpen
git clone https://github.com/CaliOpen/Caliopen
 ```

## Setup external dependencies

Using govendor external dependencies will be fetch into your Caliopen repository

```
cd $GOPATH/src/github.com/CaliOpen/CaliOpen
go get -u github.com/kardianos/govendor
govendor sync -v
```

Directory $GOPATH/src/github.com/CaliOpen/CaliOpen/src/backend/vendor contain
all external golang dependencies for all Caliopen services written in this
language.

## Build

Refer to devtools/package.yaml file for services in go language and their
build command

For example:

```
go build github.com/CaliOpen/CaliOpen/src/backend/protocols/go.smtp/cmd/caliopen_lmtpd
```

Will produce a caliopen_lmtp binary from where this command is launched inside the $GOPATH
