# Caliopen installation

_For **production deployment**, please go to the [production documentation](../production/)_

Here you will find tools for CaliOpen developments.
There is many possibles scenarios for setup of an environment development, depending on what you want to do.

* [Native](./native-installation.md) for backend development purposes (golang & python)
* [Frontend development](./frontend-development.md) (js & react)

## Tools

The [devtools directory](../../devtools) contains useful commands for development.
_Most of this commands run natively and don't work in a dockerized environment._

* api-mock: it's full js mock api, it used by travis for frontend functional tests
* storybook: its purpose is to show react components for designer & frontend developers
* bootstrap-debian.sh: **FIXME**
* clean-dev-storage.sh: **FIXME**
* gen-swagger-spec.sh: (native) re-generate swagger file and store it into [`src/backend/doc/api`](../../src/backend/doc/api/) directory
* inject_bulk_emails.go: **FIXME**
* inject_mail.py: **FIXME**
* make_release: **FIXME**
* manage_package: **FIXME**
* run-tests.sh: start tests in travis, this launch frontend or backend tests according to recent changes
* setup-virtualenv.sh:  **FIXME**
* uuid.go: **FIXME**


## Staging scenarios

Please refer to [ansible-poc][ansible-poc] project, this will prepare your host and start Caliopen
in stable mode (latest release).

Under the hood it will run docker-compose with production config:

```bash
docker-compose -f docker-compose.staging.yml up -d frontend broker
```

[ansible-poc]: https://github.com/CaliOpen/ansible-poc
