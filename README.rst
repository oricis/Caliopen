caliopen.smtp
=============

SMTP Service for caliopen.

Usage:

Start this container from [CaliOpen/caliopen-dev](CaliOpen/caliopen-dev) repository:

```
cd bin
docker-compose up smtp
```

Send a mail using telnet `telnet localhost 25`:

```
helo client
mail from: root@localhost
rcpt to: dev@caliopen.local
data
Subject: T2

foo

.
```

_Obviously, the whole caliopen instance must be running and the user related to this rcpt should
exists in order to create the message:_

```
caliopen -f caliopen.yaml create_user -e dev@caliopen.local -g John -f Dœuf -p 123456
```
