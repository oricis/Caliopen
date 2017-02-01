const { SpecReporter } = require('jasmine-spec-reporter');

const cfg = {
  capabilities: {
    // firefox
    browserName: 'chrome',
    maxInstances: 1,
  },
  specs: ['./features/**/*-spec.js'],
  jasmineNodeOpts: {
    showColors: true,
    print: () => {},
    defaultTimeoutInterval: 50 * 1000,
  },
  baseUrl: 'http://localhost:4000/',
  onPrepare: () => {
    browser.ignoreSynchronization = true;
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: 'specs',
    }));
  },
};

if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
  const branch = (process.env.TRAVIS_PULL_REQUEST_BRANCH.length > 0) ?
    process.env.TRAVIS_PULL_REQUEST_BRANCH :
    process.env.TRAVIS_BRANCH;

  cfg.sauceUser = process.env.SAUCE_USERNAME;
  cfg.sauceKey = process.env.SAUCE_ACCESS_KEY;
  cfg.multiCapabilities = [
    {
      browserName: 'firefox',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_JOB_NUMBER,
      name: `CaliOpen e2e - ${branch}`,
    },
    // {
    //   browserName: 'Internet Explorer',
    //   plateform: 'Windows 10',
    //   version: '11.103',
    //   'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    //   build: process.env.TRAVIS_JOB_NUMBER,
    //   name: `CaliOpen e2e - ${branch}`,
    // },
    // {
    //   browserName: 'Safari',
    //   plateform: 'OS X 10.11',
    //   version: '9.0',
    //   'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    //   build: process.env.TRAVIS_JOB_NUMBER,
    //   name: `CaliOpen e2e - ${branch}`,
    // },
  ];
}

exports.config = cfg;
