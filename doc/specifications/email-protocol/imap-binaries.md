# Caliopen IMAP binaries

2 programs to handle IMAP related operations :
- **imapworker** : daemon that listen to NATS orders to fetch/sync remote accounts.  
Must be launched with the rest of Caliopen's stack.
- **imapctl** : cli for on-demand IMAP operations and/or remote identities operations.

## imapworker

A daemon to launch before requesting any IMAP operations.  
It needs a config file. A default one is at `src/backend/configs/caliopen-imap-worker_dev.yaml`

### dependencies

_imapworker_'s dependencies will be installed with Caliopen's stack. If you checked-out `feature/worker/imap-fetcher` into your current stack, run `govendor sync` to ensure all required dependencies.

### launching

```shell
cd src/backend/protocols/go.imap/cmd/imapworker
go run main.go start
# if binary has been build :
imapworker start
```

### building

```shell
go build github.com/CaliOpen/Caliopen/src/backend/protocols/go.imap/cmd/imapworker
```

### using

Start _imapworker_ once with the rest of the stack and keep it running as a daemon.
If you need help : `go run main.go` or `imapworker` without any command will prompt available commands and flags.

## imapctl

_imapctl_ is a CLI to do on-demand operations.  
For now it has three available commands :
- `fullfetch` : to fetch all mails from a remote IMAP mailbox into user account, without any synchronization and without keeping last state sync.
- `addremote` : to create a new remote identity in db
- `syncremote` : to sync emails for a remote identitiy.  

**NB** : `fullfetch` and `syncremote` commands need `imapworker` to run in background to work properly.  
_imapctl_ needs the same config file as _imapworker_'s one.

### dependencies

_imapctl_'s dependencies will be installed with Caliopen's stack. If you checked-out `feature/worker/imap-fetcher` into your current stack, run `govendor sync` to ensure all required dependencies.

### launching

```shell
cd src/backend/protocols/go.imap/cmd/imapctl
go run main.go [command] [flags]
# if binary has been build :
imapctl [command] [flags]
```

### building

```shell
go build github.com/CaliOpen/Caliopen/src/backend/protocols/go.imap/cmd/imapctl
```

### using

Invoke _imapctl_ without any command or flags to print help message.

### examples :

- To blindly fetch all mails from a remote mailbox into user account :

  ```shell
  imapctl fullfetch --login 'account@provider.tld' --pass 'your_imap_password' --server 'remote.server.address:port' --mailbox 'box_name' --userid xxxxx-local-user-id-xxxxx
  ```

  _--mailbox_ flag is optionnal, default is `INBOX`


- To be able to sync a remote mailbox (ie fetch only new mails after the first synchronization), you need first to create and store a remote identity :

  ```shell
  imapctl addremote --login 'account@provider.tld' --pass 'your_imap_password' --server 'remote.server.address:port' --userid xxxxx-local-user-id-xxxxx
  ```

  if you omit _--password_, you'll need to give it to _imapctl syncremote_ at each invocation.

  For now, default mailbox is `INBOX`

  Add as many remote identities as needed.

- To synchronize a remote identity account, ie to fetch all emails first time then only new ones :

  ```shell
  imapctl syncremote --userid xxxxx-local-user-id-xxxxx --identifier 'account@provider.tld'
  ```

  _impactl syncremote_ will make sync operations and quit.  

  Relaunch it each time you want to sync or add the command to your cron.

## idpoller

A daemon that loads remote identities from cassandra and schedule jobs accordingly.
It needs a config file. A default one is at `src/backend/configs/caliopen-IDs-poller_dev.yaml`

### how it works :

_idpoller_ periodically finds 'active' remote identities in cassandra and schedule jobs accordingly in an internal cron table. "Jobs" consist of sending messages on nats queue to trigger _imapworker_ actions.

How often _idpoller_ scans remote identity table in cassandra is define within configuration file in 'scan_interval' setting. Default is 15 minutes.

_idpoller_ schedules a recurring job for each 'active' remote identity according to the `infos.pollinterval` value in remote_identity table. Default to 15 minutes if the value is missing.

**NB** : _idpoller_ schedules the sending of messages on nats queue. If no subscriber listen to the queue, no action will be triggered.

### dependencies

_idpoller_'s dependencies will be installed with Caliopen's stack. If you checked-out `feature/worker/imap-poller` into your current stack, run `govendor sync` to ensure all required dependencies.

### launching

```shell
cd src/backend/workers/go.remoteIDs/cmd/idpoller
go run main.go start
# if binary has been build :
idpoller start
```

### building

```shell
go build github.com/CaliOpen/Caliopen/src/backend/workers/go.remoteIDs/cmd/idpoller
```

### using

Start _idpoller_ once with the rest of the stack and keep it running as a daemon.
If you need help : `go run main.go` or `idpoller` without any command will prompt available commands and flags.