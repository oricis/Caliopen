## Identities in Caliopen

### Intro

Before summer 2018, Caliopen stack had 2 kinds of _identity_ objects to store data about user's accounts : _RemoteIdentity_ and _LocalIdentity_. While we made use of _LocalIdentity_ to store data about user's local Caliopen email account, we introduced _RemoteIdentity_ to store data about external accounts belonging to him. This design led us to redundant code and models. Decision was made to merge _LocalIdentity_ and _RemoteIdentity_ into a unique object, an **UserIdentity**.

###Definitions and backend architecture

####Definition

An _UserIdentity_ is an account belonging to an user at a communication service provider. It can be _local_ — for example an email address hosted on local Caliopen instance —, or _remote_ — for example an external mastodon account.

At creation, each Caliopen user has at least one _UserIdentity_, representing its Caliopen email box. This _UserIdentity_ is of `type=local` and has `protocol=smtp`.

#### Model

```yaml
type: object
properties:
  credentials:    # set of key/value strings
    type: object
    additionalProperties:
      type: string
  display_name:
    type: string
  identifier:
    type: string
  identity_id:
    type: string
  infos:          # set of key/value strings
    type: object
    additionalProperties:
      type: string
  last_check:
    type: string
    format: date-time
  protocol:
    type: string
    enum:
    - imap
    - smtp
  status:
    type: string
    enum:
    - active
    - inactive
    - deleted
  type:
    type: string
    enum:
    - local
    - remote
  user_id:
    type: string
required:
- identifier
- identity_id
- infos
- protocol
- type
- status
- user_id
```

Has shown above, _UserIdentity_ has a set of mandatory properties. Among them, there are **2 mandatory immutable**  properties :

- `identifier` : an email address, XMPP account, twitter account, etc. For example `me@caliopen.org`
- `protocol` : smtp, sms, twitter, etc.

The pair `identifier + protocol` must be unique within an user account. It can't be changed, ie data must be copied into a new _UserIdentity_ if one wants to modify this pair.

### ReST API

#### Identities APIs

Identities APIs keep legacy routes to manage either _local_ or _remote_ identies on 2 different path : `…/identities/locals…` and `…/identities/remotes…`.

Routes :

- `GET …/api/v2/identities/locals` to get an array of _UserIdentity_ of type `local`
- `GET …/api/v2/identities/locals/{identity_id}` to get one _UserIdentity_ of type `local`
- `GET …/api/v2/remotes` to get an array of _UserIdentity_ of type `remote`
- `POST …/api/v2/remotes` to create a new _UserIdentity_ of type `remote`
- `GET PATCH DELETE …/api/v2/remotes/{identity_id}` to operate on one _UserIdentity_ of type `remote`

When creating a new remote identity (on route `…/api/v2/identities/remotes`) client MUST provide properties `protocol` and `identifier`. These properties are then immutable.

NB : UserIdentity's `type` property will be enforced by backend on `POST` and `PATCH` verbs to match route (ie `type=remote` on routes `…/identities/remotes` and `type=local` on `…/identities/locals`), even if client provides a wrong type.

#### Draft API

Routes :

- `POST …/api/v1/messages`
- `PATCH …/api/v1/messages/{message_id}`

When creating or editing a draft message, client MUST provide one _UserIdentity_ on behalf of which the message will be sent. It can be a _local_ or _remote_ identity. (For now, only one identity per message is supported)

Client links a draft to an _UserIdentity_ by embedding `identity_id` into draft's `user_identities` property : 

```json
POST …/api/vi/messages
{
	"subject": "My subject",
	"user_identities": ["ae8c45d2-c085-4fa9-bbd9-5ec83b4c8469"],
	"participants": [
		{
			"address": "dev@caliopen.local",
			"label": "Dev Idoire",
			"protocol": "email",
			"type": "To"
		}
	],
	"body": "my message"
}
```

As shown above, model for _Message_ object (and consequently for draft) has slightly changed. Property `identities` has been renamed to `user_identities`, and is now an array of strings representing a set of `user_identity_id`. Here is an example of a simple message sent by an user : 

```json
{
	"body": "My message",
	"body_is_plain": true,
	"excerpt": "l…",
	"date": "2018-07-20T15:56:06.062Z",
	"date_insert": "2018-07-20T15:53:07.648Z",
	"date_sort": "2018-07-20T15:56:06.062Z",
	"discussion_id": "51d367b2-240a-4db0-8d4d-cedf592b1306",
	"external_references": {
		"message_id": "wkFJWsiC5vHTJcdxEIMvJD0zBL412b_LQ091DmNZdZw=@caliopen.org"
	},
	"user_identities": [
		"ae8c45d2-c085-4fa9-bbd9-5ec83b4c8469"
	],
	"importance_level": 0,
	"is_answered": false,
	"is_draft": false,
	"is_unread": false,
	"is_received": false,
	"message_id": "de7a5f69-905c-4158-8bdc-9a1e2ac1f197",
	"participants": [
		{
			"address": "dev@caliopen.local",
			"label": "Dev Idoire",
			"protocol": "email",
			"type": "To"
		},
		{
			"address": "dev@caliopen.local",
			"contact_ids": [
				"fb94efe5-1ff6-43cf-9823-5ec3887bc3fb"
			],
			"label": "Dev Idoire",
			"protocol": "email",
			"type": "From"
		}
	],
	"raw_msg_id": "cb61ca60-1931-4ae6-b036-67baf50aea76",
	"subject": "My subject",
	"type": "email",
	"user_id": "6cc36d88-6163-4465-805a-cacf58f455e4"
}
```

#### User model

_User_ object has no longer a `local_identities` property embedded. Call to `…/identites/locals`  to fetch relevant data.

