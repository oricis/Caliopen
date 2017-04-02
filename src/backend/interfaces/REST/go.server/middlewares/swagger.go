// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package http_middleware

import (
	"bufio"
	"errors"
	"fmt"
	log "github.com/Sirupsen/logrus"
	"github.com/go-openapi/analysis"
	swaggererrors "github.com/go-openapi/errors"
	"github.com/go-openapi/loads"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/runtime/middleware/untyped"
	"github.com/go-openapi/spec"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/validate"
	"gopkg.in/gin-gonic/gin.v1"
	"io"
	"net"
	"net/http"
	"strings"
	"sync"
)

var (
	swaggerJSON map[string]interface{}
)

const (
	noWritten     = -1
	defaultStatus = 200
)

type routableUntypedAPI struct {
	api             *untyped.API
	hlock           *sync.Mutex
	handlers        map[string]map[string]http.Handler
	defaultConsumes string
	defaultProduces string
}

// checks that inputs and/or outputs conform to the swagger specs for the route
// this middleware should be registred as the first middleware to ensure that it checks
// requests before any handling and it checks responses at last.
func SwaggerValidator(specDoc *loads.Document) gin.HandlerFunc {
	//spec := specDoc.Spec()
	analyser := specDoc.Analyzer
	log.Infoln("paths : %+v", analyser.AllPaths())
	swagAPI := untyped.NewAPI(specDoc)
	swagAPI.WithJSONDefaults()

	swagCtx := middleware.NewContext(specDoc, swagAPI, nil)

	swagRoutableAPI := newRoutableUntypedAPI(specDoc, swagAPI, swagCtx)

	swagRouter := middleware.DefaultRouter(specDoc, swagRoutableAPI)
	swagRoutableCtx := middleware.NewRoutableContext(specDoc, swagRoutableAPI, swagRouter)

	return func(ctx *gin.Context) {
		SwaggerInboundValidation(ctx, specDoc, swagRoutableCtx)
		ctx.Next()
		//SwaggerOutboundValidation(ctx)
	}
}

func InitSwaggerMiddleware(swaggerFile string) (specDoc *loads.Document, err error) {
	log.Infoln("Loading swagger specifications…")
	specDoc, err = loads.JSONSpec(swaggerFile)

	if err != nil {
		return nil, err
	}

	result := validate.Spec(specDoc, strfmt.Default)
	if result == nil {
		log.Printf("The swagger spec at %q is valid against swagger specification %s\n", swaggerFile, specDoc.Version())
	} else {
		str := fmt.Sprintf("The swagger spec at %q is invalid against swagger specification %s. see errors :\n", swaggerFile, specDoc.Version())
		for _, desc := range result.(*swaggererrors.CompositeError).Errors {
			str += fmt.Sprintf("- %s\n", desc)
		}
		return nil, errors.New(str)
	}

	return
}

func SwaggerInboundValidation(ctx *gin.Context, specDoc *loads.Document, swagCtx *middleware.Context) {
	trimpath := strings.TrimPrefix(ctx.Request.URL.EscapedPath(), specDoc.BasePath())

	an := specDoc.Analyzer
	op, found := an.OperationFor(ctx.Request.Method, trimpath)
	if !found {
		log.Warnln("operation not found")
		ctx.Abort()
		return
	}
	log.Infoln(op)

	/*
		middleware.NewRouter(swagCtx, nil)

		log.Infof("swagContext : %+v", swagCtx)


		matchRoute, found := swagCtx.LookupRoute(ctx.Request)

		if !found {
			log.Warnln("route not found")
			ctx.Abort()
			return
		}
		log.Infoln(matchRoute)
		validation, err := swagCtx.BindAndValidate(ctx.Request, matchRoute)
		if err != nil {
			log.WithError(err)
			ctx.Abort()
		}
		log.Infoln(validation)*/
	/*
		swagAPI := untyped.NewAPI(specDoc)
		swagAPI.Validate()
		oh, _ := swagAPI.OperationHandlerFor("GET","v2/username/isAvailable")
		log.Infof("handlers : %+v", oh)
		//swagCtx := middleware.NewContext(specDoc, swagAPI, routes)
	*/
}

func SwaggerOutboundValidation(ctx *gin.Context) {

}

func newRoutableUntypedAPI(spec *loads.Document, api *untyped.API, context *middleware.Context) *routableUntypedAPI {
	var handlers map[string]map[string]http.Handler
	if spec == nil || api == nil {
		return nil
	}
	analyzer := analysis.New(spec.Spec())
	for method, hls := range analyzer.Operations() {
		um := strings.ToUpper(method)
		for path, op := range hls {
			schemes := analyzer.SecurityDefinitionsFor(op)

			if oh, ok := api.OperationHandlerFor(method, path); ok {
				if handlers == nil {
					handlers = make(map[string]map[string]http.Handler)
				}
				if b, ok := handlers[um]; !ok || b == nil {
					handlers[um] = make(map[string]http.Handler)
				}

				var handler http.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					// lookup route info in the context
					route, _ := context.RouteInfo(r)

					// bind and validate the request using reflection
					bound, validation := context.BindAndValidate(r, route)
					if validation != nil {
						context.Respond(w, r, route.Produces, route, validation)
						return
					}

					// actually handle the request
					result, err := oh.Handle(bound)
					if err != nil {
						// respond with failure
						context.Respond(w, r, route.Produces, route, err)
						return
					}

					// respond with success
					context.Respond(w, r, route.Produces, route, result)
				})

				if len(schemes) > 0 {
					handler = newSecureAPI(context, handler)
				}
				handlers[um][path] = handler
			}
		}
	}

	return &routableUntypedAPI{
		api:             api,
		hlock:           new(sync.Mutex),
		handlers:        handlers,
		defaultProduces: api.DefaultProduces,
		defaultConsumes: api.DefaultConsumes,
	}
}

func (r *routableUntypedAPI) HandlerFor(method, path string) (http.Handler, bool) {
	r.hlock.Lock()
	paths, ok := r.handlers[strings.ToUpper(method)]
	if !ok {
		r.hlock.Unlock()
		return nil, false
	}
	handler, ok := paths[path]
	r.hlock.Unlock()
	return handler, ok
}
func (r *routableUntypedAPI) ServeErrorFor(operationID string) func(http.ResponseWriter, *http.Request, error) {
	return r.api.ServeError
}
func (r *routableUntypedAPI) ConsumersFor(mediaTypes []string) map[string]runtime.Consumer {
	return r.api.ConsumersFor(mediaTypes)
}
func (r *routableUntypedAPI) ProducersFor(mediaTypes []string) map[string]runtime.Producer {
	return r.api.ProducersFor(mediaTypes)
}
func (r *routableUntypedAPI) AuthenticatorsFor(schemes map[string]spec.SecurityScheme) map[string]runtime.Authenticator {
	return r.api.AuthenticatorsFor(schemes)
}
func (r *routableUntypedAPI) Formats() strfmt.Registry {
	return r.api.Formats()
}
func (r *routableUntypedAPI) DefaultProduces() string {
	return r.defaultProduces
}
func (r *routableUntypedAPI) DefaultConsumes() string {
	return r.defaultConsumes
}
func newSecureAPI(ctx *middleware.Context, next http.Handler) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		route, _ := ctx.RouteInfo(r)
		if route != nil && len(route.Authenticators) == 0 {
			next.ServeHTTP(rw, r)
			return
		}

		if _, err := ctx.Authorize(r, route); err != nil {
			ctx.Respond(rw, r, route.Produces, route, err)
			return
		}

		next.ServeHTTP(rw, r)
	})
}

type SwaggerWriter struct {
	http.ResponseWriter
	size   int
	status int
}

func (sw *SwaggerWriter) reset(writer http.ResponseWriter) {
	sw.ResponseWriter = writer
	sw.size = noWritten
	sw.status = defaultStatus
}

func (sw *SwaggerWriter) WriteHeader(code int) {
	if code > 0 && sw.status != code {
		if sw.Written() {
			log.Warnf("[WARNING] Headers were already written. Wanted to override status code %d with %d", sw.status, code)
		}
		sw.status = code
	}
}

func (sw *SwaggerWriter) WriteHeaderNow() {
	if !sw.Written() {
		sw.size = 0
		sw.ResponseWriter.WriteHeader(sw.status)
	}
}

func (sw *SwaggerWriter) Write(data []byte) (n int, err error) {
	sw.WriteHeaderNow()
	n, err = sw.ResponseWriter.Write(data)
	sw.size += n
	return
}

func (sw *SwaggerWriter) WriteString(s string) (n int, err error) {
	sw.WriteHeaderNow()
	n, err = io.WriteString(sw.ResponseWriter, s)
	sw.size += n
	return
}

func (sw *SwaggerWriter) Status() int {
	return sw.status
}

func (sw *SwaggerWriter) Size() int {
	return sw.size
}

func (sw *SwaggerWriter) Written() bool {
	return sw.size != noWritten
}

// Implements the http.Hijacker interface
func (sw *SwaggerWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	if sw.size < 0 {
		sw.size = 0
	}
	return sw.ResponseWriter.(http.Hijacker).Hijack()
}

// Implements the http.CloseNotify interface
func (sw *SwaggerWriter) CloseNotify() <-chan bool {
	return sw.ResponseWriter.(http.CloseNotifier).CloseNotify()
}

// Implements the http.Flush interface
func (sw *SwaggerWriter) Flush() {
	sw.ResponseWriter.(http.Flusher).Flush()
}
