# Architecture

The Caliopen client is a react application.

It is [a migration from angular1](https://github.com/CaliOpen/caliopen.web-client-ng). It was using
the [@toddmotto
styleguide](https://github.com/toddmotto/angular-styleguide#angular-1x-styleguide-es2015) in order
to make the migration more easy.

The actual code mainly follows this basic [React
tutorial](http://www.robinwieruch.de/the-soundcloud-client-in-react-redux/) and uses this
recommended [file
structure](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1#.4t2oi46lj).

The main folders in src are:

* components: UI components that will be moved to its own module
* layouts: components rendering the layouts (Page, Auth, SubLayout ...)
* modules: domain specific with business logic (it can contains components, services etc.)
* scenes: routed components (Timeline, Contact, ...)
* services: pure functions with no relations with react nor redux
* store: state management with redux (actions, reducers, selectors, middlewares)
* styles: configuration and shared scss functions
