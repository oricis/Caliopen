# Caliopen frontend

This subtree is meant for building and serving CaliOpen frontend.

* serving html, js and static files
* build web application
* build or run desktop applications
* build or run mobile devices applications

## Prerequisite

* [yarn](https://yarnpkg.com/en/docs/install)

_(make sure you have an up-to-date version)_

## Usage (production ready)

This will install dependencies then start the web server. Depending you custom options, you will be
able to access to Caliopen interface via http://0.0.0.0:4000

```
export NODE_ENV=production
yarn
bin/server
```

### Options

You can set instance settings via environment variables and a js/json file:

```
export CALIOPEN_API_HOSTNAME=api.foobar.tld
```

```
bin/server --config=<path-to-file>.[js|json]
```

The default variables are set in `config/server.default.js`.

We **strongly** recommand to overide `CALIOPEN_COOKIE_SECRET` and `CALIOPEN_SEAL_SECRET`.

The precedence of config definitions:

> custom file > env var > defaults

## Release

```
NODE_ENV=production yarn release
```

This will build the different packages to run Caliopen web server in the dist directory.

## Code architecture

All the things related to react follows [this guide](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1#.rwqbggzgf) in `src` folder.

Each build target has its folder:

* server (the web server providing html pages thanks to SSR and the javascript browser client)
* cordova (for platforms android, ios and WP)
* electron (for linux, macos and windows)

The `index.html` is generated using webpack and a `template`.

And each target has its `webpack` config.
