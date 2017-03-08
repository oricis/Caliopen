// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package rest_api

import (
	obj "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	"github.com/CaliOpen/CaliOpen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/CaliOpen/src/backend/interfaces/REST/go.server/operations/users"
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.main"
	log "github.com/Sirupsen/logrus"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/redis.v5"
)

var (
	server *REST_API
	caliop caliopen.RESTservices
)

type (
	REST_API struct {
		config APIConfig
		cache  *redis.Client
	}

	APIConfig struct {
		Host          string `mapstructure:"host"`
		Port          string `mapstructure:"port"`
		BackendConfig `mapstructure:"BackendConfig"`
		CacheSettings `mapstructure:"CacheConfig"`
	}

	BackendConfig struct {
		BackendName string          `mapstructure:"backend_name"`
		Settings    BackendSettings `mapstructure:"backend_settings"`
	}

	BackendSettings struct {
		Hosts       []string `mapstructure:"hosts"`
		Keyspace    string   `mapstructure:"keyspace"`
		Consistency uint16   `mapstructure:"consistency_level"`
	}

	CacheSettings struct {
		Host     string `mapstructure:"host"`
		Password string `mapstructure:"password"`
		Db       int    `mapstructure:"db"`
	}
)

func InitializeServer(config APIConfig) error {
	server = new(REST_API)
	return server.initialize(config)
}

func (server *REST_API) initialize(config APIConfig) error {
	server.config = config

	//init Caliopen facility
	caliopenConfig := obj.CaliopenConfig{
		RESTstoreConfig: obj.RESTstoreConfig{
			BackendName: config.BackendName,
			Hosts:       config.BackendConfig.Settings.Hosts,
			Keyspace:    config.BackendConfig.Settings.Keyspace,
			Consistency: config.BackendConfig.Settings.Consistency,
		},
	}

	err := caliopen.Initialize(caliopenConfig)

	if err != nil {
		log.WithError(err).Fatal("Caliopen facilities initialization failed")
	}

	caliop = caliopen.Facilities.RESTfacility

	//TODO : manage credentials & connection with config & backends interface
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	_, err = client.Ping().Result()
	if err != nil {
		return err
	}
	server.cache = client
	return nil
}

func StartServer() error {
	return server.start()
}

func (server *REST_API) start() error {
	// Creates a gin router with default middleware:
	// logger and recovery (crash-free) middleware
	router := gin.Default()
	// adds our middlewares
	//router.Use(SwaggerInboundValidation())

	// adds our routes and handlers
	api := router.Group("/api/v2")
	server.AddHandlers(api)

	// listens
	addr := server.config.Host + ":" + server.config.Port
	err := router.Run(addr)
	if err != nil {
		log.WithError(err).Warn("unable to start gin server")
	}
	return err
}

func (server *REST_API) AddHandlers(api *gin.RouterGroup) {

	//users API
	u := api.Group("/users")
	u.POST("", func(ctx *gin.Context) {
		users.Create(caliop, ctx)
	})
	u.GET("/:user_id", func(ctx *gin.Context) {
		users.Get(caliop, ctx)
	})

	//username API
	api.GET("/username/isAvailable", func(ctx *gin.Context) {
		users.IsAvailable(caliop, ctx)
	})

	//messages API
	//messages := api.Group("/messages", http_middleware.BasicAuthFromCache(server.cache, "caliopen"))
	draft := api.Group("/draft", http_middleware.BasicAuthFromCache(server.cache, "caliopen"))
	draft.GET("", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"access": "authorized",
		})
	})
	draft.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"access": "authorized",
		})
	})
}
