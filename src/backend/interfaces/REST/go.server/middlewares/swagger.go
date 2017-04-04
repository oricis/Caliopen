// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package http_middleware

import (
	"gopkg.in/gin-gonic/gin.v1"
	"reflect"
)

var (
	swaggerJSON map[string]interface{}
)

func InitSwaggerMiddleware(swaggerFile string) error {

	swaggerJSON = map[string]interface{}{}
	return nil
}

func SwaggerInboundValidation() gin.HandlerFunc {
	return func(c *gin.Context) {
		//TODO
		c.Next()
	}
}

// checks that inputs and/or outputs conform to the swagger specs for the route
func SwaggerValidator(obj interface{}) gin.HandlerFunc {
	//TODO

	/* should look something like :
	SwaggerInboundValidation()
	next()
	SwaggerOutboundValidation()
	*/

	return func(ctx *gin.Context) {

		//var errors Errors
		v := reflect.ValueOf(obj)
		k := v.Kind()
		if k == reflect.Interface || k == reflect.Ptr {
			v = v.Elem()
			k = v.Kind()
		}
		if k == reflect.Slice || k == reflect.Array {
			for i := 0; i < v.Len(); i++ {
				/*
				   e := v.Index(i).Interface()
				   errors = validateStruct(errors, e)
				   if validator, ok := e.(Validator); ok {
				           errors = validator.Validate(ctx, errors)
				   }
				*/
			}
		} else {
			/*
			   errors = validateStruct(errors, obj)
			   if validator, ok := obj.(Validator); ok {
			           errors = validator.Validate(ctx, errors)
			   }
			*/
		}
		//ctx.Map(errors)
	}
}
