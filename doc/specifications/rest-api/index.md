# ReST API documentation

ReST API is documented using [OpenAPI specification v2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)

you will find the related swagger definition file [here](../../src/backend/doc/api/swagger.json) but it is never edited directly, it has to be generated using the JSON Schema definitions files [here](../../src/backend/defs/rest-api/).

A python package [caliopen_api_doc](../../src/backend/tools/py.doc), acting as pyramid.includes service add a swagger-ui component for documentation and interaction with the API on your [local installation](http://localhost:6543/api-ui/#/)


To start testing it no part of Caliopen is yet installed, and you have docker and docker-compose installed, just run:

```
cd ../../devtools
docker-compose build
docker-compose up -d api
```

To start play with the API (v1)
