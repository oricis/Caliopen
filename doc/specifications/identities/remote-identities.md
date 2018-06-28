### Remote identities specifications

#### Definition :

A _remote identity_ is an object that store data about an account on an external server (server address, credentials, etc). A _remote identity_ could be use to receive/send messages through a distant server using any supported protocol (smtp/imap, xmpp, etc.)

#### Model :

```yaml
type: object
properties:
  credentials:    # set of key/value strings
    type: object
    additionalProperties:
      type: string
  display_name:
    type: string
  identifier:     # email address, mastodon/twitter account, etc.
    type: string
  infos:          # set of key/value strings
    type: object
    additionalProperties:
      type: string
  last_check:
    type: string
    format: date-time
  remote_id:
    type: string
  status:
    type: string
    enum:
    - active
    - inactive
    - deleted
  type:
    type: string
    enum:
    - imap
required:
- infos
- type
```

`credentials` and `infos` are key/value map strings by design, to allow a wide range of data to be embedded into a _remote identity_, depending on type and protocol.

Remote identities examples : 

- An **imap** remote identity stores credentials and server addresses for 2 remote services : an IMAP server to retrieve mail from and to synchronize messages' states, and a SMTP server to send emails through :

```yaml
credentials:
  inusername: "my_username@server.tld"            # username to login ingress server
  inpassword: "my_password"                       # password for ingress server
  outusername: "my_username@server.tld"           # username to login egress server
  outpassword: "my_password"                      # password for egress server
display_name: My Imap account
identifier: me@server.tld
infos:
  lastseenuid: '3996'                             # property managed by imap worker, do not edit
  lastsync: '2018-06-21T13:56:06+02:00'			 # property managed by imap worker, do not edit
  pollinterval: '10'                              # poll interval in minutes
  inserver: box.mailden.net:993                   # server address and port to fetch mail from
  outserver: post.mailden.net:587                 # server address and port to send mail through
  uidvalidity: '623613176'                        # property managed by imap worker, do not edit
last_check: '2018-06-21T11:56:06.719Z'            # property managed by imap worker, do not edit
remote_id: 19421c2c-9d74-4d32-adcc-a3ede3ae7eea
status: active
type: imap
```

