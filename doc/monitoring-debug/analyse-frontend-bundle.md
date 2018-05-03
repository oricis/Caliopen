# Analyse frontend bundle

## bundle size

This is useful to see the real size of the js files loaded by the client.

**Pre-requisites**

You need source-map-explorer: `npm i -g source-map-explorer`

1. release the frontend:

  ```bash
  yarn release:web:browser
  ```

2. Launch the explorer for each generated file you want

  ```bash
  source-map-explorer dist/server/public/assets/app.{hash}.js
  source-map-explorer dist/server/public/assets/vendor.{hash}.js
  ...
  ```

These command will generate an html page in temp dir with a dynimic tree of the bundle

## webpack module tree

This tree shows all modules handled by webpack and see size usage

**Pre-requisites**

You need webpack-bundle-analyzer: `npm i -g webpack-bundle-analyzer`

1. generate stats

  ```bash
  NODE_ENV=production webpack --config webpack/webpack.config.browser.js -p --progress --profile --json > webpack-client-stats.json
  ```

2. launch analyser tool (it's little webserver)

  ```bash
  webpack-bundle-analyzer -p 4444 webpack-client-stats.json
  ```

Also, you can upload the stats on http://webpack.github.io/analyse which can provide other useful informations
