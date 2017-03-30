# API mock

The purpose of this package is to mock the whole API using [bouchon][bouchon], it uses redux to
collect and render data in an oriented ReSTful server.

## Requirements

* [Node.js][node] >= 6
* [yarn][yarn] >= 0.21

## Usage

Launch `bin/start`, it will install and start the mock server on port `31415`.

## Dev

The entry file is `all.fixture.js`, it loads all routes (and config) in the Javascript ES6 way.

Each "route" folders contain configs and [redux][redux] actions and reducers in the `index.js` file
and the initial fixtures in `data.json`.

There a middleware to tweak the response (e.g for route collection).

## TODO

It could great to:

* validates the response using a swagger parser and throw when the response is no more consistent
with the real API
* generate fake datas (faker.js) for not configured routes (using the swagger parser)

[bouchon]: https://github.com/cr0cK/bouchon
[node]: http://nodejs.org/
[yarn]: https://yarnpkg.com
[redux]: http://redux.js.org/
