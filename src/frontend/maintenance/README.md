# Maintenance page

It provide a simple html page in a docker container.
This service is based on [nginx docker image](https://hub.docker.com/_/nginx/).

## USAGE

```
docker build -t caliopen-maintenance .
docker run --name caliopen-maintenance-container -p 8080:80 -d caliopen-maintenance
# or eventually w/ a full nginx config
docker run --name caliopen-maintenance-container -p 8080:80 -v /host/path/nginx.conf:/etc/nginx/conf.d/default.conf:ro -d caliopen-maintenance
```

The maintenance page will be available on http://localhost:8080
