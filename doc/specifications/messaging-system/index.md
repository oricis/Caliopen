# Messaging system in Caliopen
Caliopen relies on **nats** messaging system to exchange data between services.  
Most of the time, messages sent on **nats** are small json documents emitted by a service to trigger an action by another service. As a matter of fact, Caliopen needs a **nats** server up and running to work properly.  
All **nats** modes may be used by services : asynchronous/synchronous, publish/subscribe, request/reply, etc. depending on use case.

## List of services connected to **nats** system
- apiv2
- mq-worker
- identities-worker
- smtp-bridge
- imap-bridge
- twitter-bridge
---
##### apiv2
###### modes :
- request/reply
- subscribe/subscribe
---
#### twitter-brigde
##### function `processInDM` :
###### mode : `request/reply`
###### order : `process_inbound`
###### trigger :
after handling an inbound Direct Message from Twitter, `processInDM` sends a request and waits for reply
###### payload :
```json
{

}
```


###### -> emmitted messages

###### <- handled messages