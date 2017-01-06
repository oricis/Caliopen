module.exports = (env) => {
  const config = {
    env,
    version: '0.1.0',
    frontend: {
      rootPath: '/app/',
      path: '/srv/caliopen/web-client-ng',
      cssFiles: ['css/main.css'],
      brandImage: 'images/brand.png',
    },
    api: {
      prefix: '/api',
      version: 'v1',
      hostname: 'api.dev.caliopen.org',
      port: 6543,
      auth: 'authentications',
      user: 'user',
    },
    cookie: {
      name: 'caliopen.web',
      'max-age': 3600,
      signed: true,
      secret: '_4+%J;_F&?#!+mR&IsYq:Xg4A*wvse',
    },
    seal: {
      secret: 'D}(2$5q)#_#yKX90,+0d5?4**a6w',
    },
  };

  let instanceInfo = {};


  switch (env) {
    default:
    case 'staging':
      instanceInfo = {
        login: 'john@mail.caliopen.me',
        password: '123456',
      };
      break;
    case 'development':
      instanceInfo = {
        login: 'dev@caliopen.local',
        password: '123456',
      };
      break;
  }

  return Object.assign({}, config, { instanceInfo });
};
