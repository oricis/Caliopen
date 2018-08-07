# Setting up functional tests with drone and saucelabs

## Using Saucelabs

[Sauce-connect](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy) is needed to tunnel requests to the local frontend. It can be run as a docker container or you can just run the binary.

### Variables

* *SAUCE_USERNAME* AND *SAUCE_ACCESS_KEY* need to be defined as **environment variables** on the machine **BEFORE** running sauce-connect and as **secrets** in the [drone dashboard](https://drone.caliopen.org/CaliOpen/Caliopen/settings/secrets).
* *SAUCE_ADDRESS* needs to be defined as a **secret** in the drone dashboard. It should contain the public ip address of the machine running sauce-connect.
* *FRONTEND_ADDRESS* is defined inside the **drone config file**: it contains the address on which the frontend is listening. In the case of running inside drone it corresponds to the IP address of the container, which turns to be 172.17.0.2. Defaults to localhost if not defined.
* *SAUCE_PORT* is also defined inside the **drone config file**: if sauce-connect is ever running on a different port than 4445, this should be changed.

Now you can run sauce-connect and then your tests.

```sh
sc -u $SAUCE_USERNAME -k $SAUCE_ACCESS_KEY --tunnel-identifier caliopen &
```

## Without Saucelabs

### Currently

We use and image based on ubuntu 16 with all the needed packages to run Selenium tests on Chrome and/or Firefox. This makes a pretty heavy image.

### Alternative

We could use drone services to run different [Selenium images](https://github.com/SeleniumHQ/docker-selenium) just like [this example](http://docs.drone.io/selenium-example/) shows.

