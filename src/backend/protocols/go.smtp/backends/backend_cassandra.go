package backends

import (
	"encoding/json"
	log "github.com/Sirupsen/logrus"
	"github.com/gocassa/gocassa"
	"github.com/gocql/gocql"
)

type CassandraBackend struct {
	config       		cassandraConfig
	keyspace		gocassa.KeySpace
}

type cassandraConfig struct {
	Hosts			[]string	`json:"hosts"`
	Keyspace		string		`json:"keyspace"`
	ConsistencyLevel	int		`json:"consistency_level"`
}

type user struct {
	User_id			[]byte
	Name			string
}

type rawMessageModel struct {
	Raw_msg_id		gocql.UUID	`cql:"raw_msg_id"`
	Data			string		`cql:"data"`
}

func (cb *CassandraBackend) Initialize(config map[string]interface{}) error {
	data, err := json.Marshal(config)
	if err != nil {
		log.WithError(err).Info(" error when marshalling backend config")
		return err
	}

	err = json.Unmarshal(data, &cb.config)

	if err != nil {
		log.WithError(err).Info(" error when marshalling backend config")
		return err
	}

	cb.keyspace, err = gocassa.ConnectToKeySpace(cb.config.Keyspace, cb.config.Hosts, "", "")
	if err != nil {
		log.WithError(err).Info("error when connecting to keyspace")
		return err
	}

	//we could also do something like that :
	/*
	    cluster := gocql.NewCluster("127.0.0.1")
    	    cluster.Consistency = gocql.One
            cluster.ProtoVersion = 4
            session, err := cluster.CreateSession()
            connection := gocassa.NewConnection(gocassa.GoCQLSessionToQueryExecutor(session))

    	    keyspace := connection.KeySpace(KeyspaceName)

	 */
	return nil
}

// return a list of users' emails found in user_name table for the given recipients list
func (cb *CassandraBackend) GetRecipients(rcpts []string) (user_ids []string, err error) {
	userTable := cb.keyspace.MapTable("user_name", "name", &user{})
	consistency := gocql.Consistency(cb.config.ConsistencyLevel)
	// need to overwrite default gocassa naming convention that add `_map_name` to the mapTable name
	userTable = userTable.WithOptions(gocassa.Options{
		TableName: "user_name",
		Consistency: &consistency,
	})

	result := user{}
	for _, rcpt := range rcpts {
		err = userTable.Read(rcpt, &result).Run()
		if err != nil {
			log.WithError(err).Infoln("error on userTable query")
			return
		}
		uuid, err := gocql.UUIDFromBytes(result.User_id)
		if err != nil {
			return []string{}, err
		}
		user_ids = append(user_ids, uuid.String())
	}
	return
}

func (cb *CassandraBackend) StoreRaw(raw_email string) (uuid string, err error) {
	rawMsgTable := cb.keyspace.MapTable("raw_inbound_msg", "raw_msg_id", &rawMessageModel{})
	consistency := gocql.Consistency(cb.config.ConsistencyLevel)

	// need to overwrite default gocassa naming convention that add `_map_name` to the mapTable name
	rawMsgTable = rawMsgTable.WithOptions(gocassa.Options{
		TableName: "raw_inbound_message",
		Consistency: &consistency,
	})

	raw_uuid, err := gocql.RandomUUID()
	m := rawMessageModel{
		Raw_msg_id: raw_uuid,
		Data: raw_email,
	}
	err = rawMsgTable.Set(m).Run()

	uuid = raw_uuid.String()
	return
}
