USE caliopen;

DROP TABLE IF EXISTS raw_inbound_msg;

CREATE TABLE raw_inbound_message (
  raw_msg_id  uuid,
  data        blob,
	PRIMARY KEY(raw_msg_id)
);
