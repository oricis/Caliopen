# Continuous Intergration (CI)

We have [an instance of drone.io][1] to test the project each time a Pull Request is made on our Github repository.

According to the files changed in the PR, this will launch the test for the backend or the frontend or both.

## CI strategy

### Pull requests

When a PR is made or a new commit appends on a PR, the event `pull_request` is thrown to drone.io, according to changed files, drone will launch **lint check, unit tests and functional tests** on backend or frontend (more info below).

Those tests are made using the [merge and checkout strategy][2] so the tests will show the results after the branch beeing merged.

### Push

When a branch is merged or commit pushed on `develop` a push event is catched by drone then build and publish docker images tagged with `develop` according to changed files.

For the `master` branch, tests are launched but no docker images are published (see tag).

### Tag

When a tag is pushed on `master`, drone will build and push stable docker images.

## Frontend

Using a node container drone launch the following tests and if one error is encountered it will stop the sequence and returns a failure.

1. Lint JS
2. Lint SCSS
3. Unit tests JS
4. Functional tests

The functional tests release a bundle, starts a mocked api (full JS using bouchon cf. devtools/api-mock) and open a socket on [Saucelabs](https://saucelabs.com) that will execute selenium commands on a real browser (Firefox 45/Linux for now).
You can see the full video of the test by browsing open results on the project account: https://saucelabs.com/open_sauce/user/AllTheDey `> Automated tests > CaliOpen e2e - <name of the branch of the PR> > Watch or Metadata > Download video`.

[1]: https://drone.caliopen.org
[2]: https://github.com/drone-plugins/drone-git/blob/master/plugin.go#L49
