# Messaging system in Caliopen
Caliopen relies on **nats** messaging system to communicate between services.  
Most of the time, messages sent on **nats** are small json documents emitted by a service to trigger an action by another service. As a matter of fact, Caliopen needs a **nats** server up and running to work properly.  
All **nats** modes may be used by services : asynchronous/synchronous, publish/subscribe, request/reply, etc. depending on use case.

## List of services making use of **nats** system
- apiv2 : listen & emit
- mq-worker : listen only
- identities-worker : listen & emit
- smtp-bridge : listen & emit
- imap-bridge : listen & emit
- twitter-bridge : listen & emit
---
#### apiv2
###### function `Notifications.SendEmailAdminToUser`:
- role: emitter
- mode: `request/reply`
- topic: `outboundSMTP`
- orders emitted: `"deliver"`
- payload: 
```json
{
  	"message_id": "xxxxxxx",
  	"order":      "deliver",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### function `REST.SendDraft`:
- role: emitter
- mode: `request/reply`
- topics: `outboundSMTP`, `outboundIMAP`, `twitter_dm`
- orders emitted: `"deliver"`
- payload:
```json
{
  	"message_id": "xxxxxxx",
  	"order":      "deliver",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### function `REST.UpdateContact`
- role: emitter
- mode: `publish/subscribe`
- topics: `contactAction`
- orders emitted: `"contact_update"`
- payload: 
```json
{
  	"order":      "contact_update",
  	"contact_id": "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### function `REST.launchKeyDiscovery`
- role: emitter
- mode: `publish/subscribe`
- topics: `keyAction`
- orders emitted: `"discover_key"`
- payload: 
```json
{
  	"order":      "discover_key",
  	"contact_id": "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### function `REST.CreateContact`
- role: emitter
- mode: `publish/subscribe`
- topics: `contactAction`
- orders emitted: `"contact_update"`
- payload: 
```json
{
  	"order":      "contact_update",
  	"contact_id": "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### function `REST.CreatePGPPubKey`
- role: emitter
- mode: `publish/subscribe`
- topics: `keyAction`
- orders emitted: `"publish_key"`
- payload: 
```json
{
  	"key_id":       "xxxxxxx",
  	"order":        "publish_key",
  	"resource_id":  "xxxxxxx",
  	"user_id":      "xxxxxxx"
}
```
###### function `REST.DeletePubKey`
- role: emitter
- mode: `publish/subscribe`
- topics: `keyAction`
- orders emitted: `"delete_key"`
- payload: 
```json
{
  	"key_id":       "xxxxxxx",
  	"order":        "delete_key",
  	"resource_id":  "xxxxxxx",
  	"user_id":      "xxxxxxx"
}
```
###### function `REST.CreateUserIdentity`
- role: emitter
- mode: `publish/subscribe`
- topics: `identitiesWorker`
- orders emitted: `"add_identity"`
- payload:
```json
{
    "identity_id":  "xxxxxxx",
  	"order":        "add_identity",
  	"user_id":      "xxxxxxx"
}
```
###### function `REST.PatchUserIdentity`
- role: emitter
- mode: `publish/subscribe`
- topics: `identitiesWorker`
- orders emitted: `"update_identity"`
- payload:
```json
{
    "identity_id":  "xxxxxxx",
  	"order":        "update_identity",
  	"user_id":      "xxxxxxx"
}
```
###### function `REST.DeleteUserIdentity`
- role: emitter
- mode: `publish/subscribe`
- topics: `identitiesWorker`
- orders emitted: `"delete_identity"`
- payload:
```json
{
    "identity_id":  "xxxxxxx",
  	"order":        "delete_identity",
  	"user_id":      "xxxxxxx"
}
```
---
#### twitter-bridge
###### function `WorkerMsgHandler`:
- role: subscriber
- mode: `publish/subscribe`
- topic: `twitter_worker `
- queue: `twitterworkers`
- orders handled : `"add_worker"`, `"reload_worker"`, `"remove_worker"`
- payload: 
```json
{
  	"order":      "xxxxxxx",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### function `DMmsgHandler`:
- role: subscriber/emitter
- mode: `publish/subscribe`
- topic: `twitter_dm`
- queue: `twitterworkers`
- orders handled: `"sync"`, `"deliver"`
- payload:
```json
{
  	"message_id": "xxxxxxx",
  	"order":      "xxxxxxx",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
- topic: `identitiesWorker`
- orders emitted: `"update_interval"`
- payload:
```json
{
    "identity_id":    "xxxxxxx",
  	"order":          "update_interval",
  	"poll_intervall": "xxxxxxx",
  	"protocol":       "twitter",
  	"user_id":        "xxxxxxx"
}
```
###### function `processInDM` :
- role: emitter
- mode : `request/reply`
- topic : `inboundTwitter`
- orders emitted: `"process_inbound"`
- payload :
```json
{
  "message_id": "xxxxxxx",
  "order":      "process_inbound",
  "remote_id":  "xxxxxxx",
  "user_id":    "xxxxxxx"
}
```
---
#### imap-bridge
###### function `natsMsgHandler`:
- role: subscriber/emitter
- mode: `publish/subscribe`
- topic: `IMAPfetcher`
- queue: `IMAPworkers`
- orders handled: `"sync"`, `"fullfetch"`
- payload:
```json
{
  	"order":      "xxxxxxx",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
- topic: `identitiesWorker`
- orders emitted: `"update_interval"`
- payload:
```json
{
    "identity_id":    "xxxxxxx",
  	"order":          "update_interval",
  	"poll_intervall": "xxxxxxx",
  	"protocol":       "imap",
  	"user_id":        "xxxxxxx"
}
```
###### function `natsMsgHandler`:
- role: subscriber
- mode: `request/reply`
- topic: `outboundIMAP`
- queue: `IMAPworkers`
- orders handled: `"deliver"`
- payload:
```json
{
    "message_id": "xxxxxxx",
  	"order":      "deliver",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### function `WorkerMsgHandler`:
- role: subscriber
- mode: `publish/subscribe`
- topic: `imap_worker `
- queue: `IMAPworkers`
- orders handled : `"add_worker"`, `"reload_worker"`, `"remove_worker"`
- payload: 
```json
{
  	"order":      "xxxxxxx",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
---
#### smtp-bridge
###### function `natsMsgHandler`:
- role: subscriber
- mode: `request/reply`
- topic: `outboundSMTP`
- queue: `SMTPqueue`
- orders handled: `"deliver"`
- payload:
```json
{
    "message_id": "xxxxxxx",
  	"order":      "deliver",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### function `processInbound`:
- role: emitter
- mode: `request/reply`
- topic: `inboundSMTP`
- orders emitted: `"process_inbound"`
- payload: 
```json
{
    "message_id": "xxxxxxx",
  	"order":      "process_inbound",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
---
#### identities-worker
###### function `imapJob.Run`:
- role: emitter
- mode: `publish/subscribe`
- topic: `IMAPfetcher`
- orders emitted: `"sync"`
- payload:
```json
{
  	"order":      "sync",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### function `twitterJob.Run`:
- role: emitter
- mode: `publish/subscribe`
- topic: `twitter_dm`
- orders emitted: `"sync"`
- payload:
```json
{
  	"order":      "sync",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### function `natsOrdersHandler`:
- role: subscriber
- mode: `publish/subscribe`
- topic: `identitiesWorker`
- queue: `IDsworker`
- orders handled: `"update_interval"`, `"add_identity"`, `"update_identity"`, `"delete_identity"`
- payload: 
```json
{
    "identity_id":    "xxxxxxx",
  	"order":          "xxxxxxx",
  	"poll_intervall": "xxxxxxx",
  	"protocol":       "xxxxxxx",
  	"user_id":        "xxxxxxx"
}
```
---
#### mq-worker
###### class `InboundEmail`:
- role: subscriber
- mode: `request/reply`
- topic: `inboundSMTP`
- queue: `SMTPqueue`
- orders handled: `process_inbound`
- payload:
```json
{
    "message_id": "xxxxxxx",
  	"order":      "process_inbound",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### class `InboundTwitter`:
- role: subscriber
- mode: `request/reply`
- topic: `inboundTwitter`
- queue: `Twitterqueue`
- orders handled: `process_inbound`
- payload:
```json
{
    "message_id": "xxxxxxx",
  	"order":      "process_inbound",
  	"remote_id":  "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### class `ContactAction`:
- role: subscriber
- mode: `publish/subscribe`
- topic: `contactAction`
- queue: `contactQueue`
- orders handled: `contact_update`
- payload:
```json
{
  	"order":      "contact_update",
  	"contact_id": "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```
###### class `KeyAction`:
- role: subscriber
- mode: `publish/subscribe`
- topic: `keyAction`
- queue: `keyQueue`
- orders handled: `discover_key`
- payload:
```json
{
  	"order":      "discover_key",
  	"contact_id": "xxxxxxx",
  	"user_id":    "xxxxxxx"
}
```