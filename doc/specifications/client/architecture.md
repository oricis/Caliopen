# Architecture
_(Code organization for the client)_

## Bootstrap

The main file is `src/App.jsx`, it is used both by SSR (expressjs http server) and the browser.
The file `src/index.js`is only used by the browser.

## Routes

The routing is declared in `src/modules/routing` and indicates which «Scene» to render.
All the Scene are in `src/scenes/`.

e.g `src/scenes/Timeline`


## Layouts

The layouts represent the page according to the context, the login form has a different layout as the timeline…

e.g. `src/layouts/Settings`

## Modules

The business logic is in those modules: `src/modules/`.
It is organized by domain and are not directly coupled so a module can be completely mocked or replaced.

e.g. `src/modules/contacts`

### Inside a module

A module has always the same architecture but all are optionnal except the index:

- `index.js`: provide an access to the public API of the module
- `actions/`: redux actions e.g. `requestContacts.js`
- `assets`: images, fonts…
- `components/`: react components (can be nested)
- `contexts`: [react contexts](https://reactjs.org/docs/context.html)
- `hoc`: [react higher order components](https://reactjs.org/docs/higher-order-components.html)
- `hooks`: [react hooks](https://reactjs.org/docs/hooks-intro.html)
- `models`: base class of entities e.g `src/modules/message/models/Message.js`
- `selectors/`: redux selectors
- `services/`: utility pure functions. Services are not coupled to redux nor react.

#### Redux actions

The API of a redux action is a function that can return an object that redux can read, a function or a Promise (cf. thunk and Promise middlewares).

e.g
```
// this a simple action cf. https://redux.js.org/introduction/getting-started#basic-example
const requestContactsBase = {
  type: 'requestContacts',
  payload: {},
};
// this is a «thunk action» that can chain multiple actions cf. https://github.com/reduxjs/redux-thunk
export const requestContacts = () => (dispatch) => dispatch(requestContactsBase);
```

## Store

This the implementation of redux using [«Ducks: Redux Reducer Bundles»](https://github.com/erikras/ducks-modular-redux/), a modular organization of [redux](https://redux.js.org/)

e.g. `src/store/reducer.js`

## Components

Each reusable component without business logic is in `src/components/`.

e.g. `src/components/Button`

## Other «main» directories

Those directories requires to be refactored because of the legacy code that can be in there. The best example is `src/services/` that should be splitted in multiple modules.
