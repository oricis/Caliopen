# Caliopen Documentation

This directory group all technical documentation related to Caliopen project.

## Content

 * [RFCs](RFCs/) acting as specification we defined for many parts of the project, and we will contiune too
 * [Automatic ReST API](api). A swagger 2.0 full definition for automatic API description and interactions
 * [Documentation for developers](for-developers). Guidelines, repository structure for the moment
 * [Dedicated python pyramid package, for swagger api plugin](py.doc)

More to come


## Tmp

One block code in js:

```js
const foo = 'bar';

const bar = () => 'hello world';
```

One block code in mermaid:

```mermaid
graph LR
A[Square Rect] -- Link text --> B((Circle))
A --> C(Round Rect)
B --> D{Rhombus}
C --> D
```

```puml
@startuml
title User signin with an unknown device

User -> Client: signin
Client -> Client: generate ecdsa keypair and a device_id

Client -> Api: POST /authentication {username, password, device}
Api -> Backend: User.authenticate(username, password)
Backend -> Api: user

Api -> Backend: Device.get(user, device_id)
Backend -> Api: Notfound
Api -> Backend: Device.create(user, device_id, ecdsa_param)
Backend -> Api: new_device

Api -> Api: generate_token()
Api -> Cache: set_token(user_id, device_id, token, device_state)
Api -> Client: 200 {user_id, token, device_id, device_state}
@enduml
```
