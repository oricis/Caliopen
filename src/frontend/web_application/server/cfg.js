module.exports = (env) => {
  const config = {
    env,
    version: '0.1.0',
    publicPaths: {
      '/': ['dist/server/public/', 'public/'],
    },
    frontend: {
      rootPath: '/',
      cssFiles: ['/assets/style.css'],
    },
    api: {
      prefix: '/api',
      version: 'v1',
      hostname: env === 'development' ? 'localhost' : 'api.dev.caliopen.org',
      port: 6543,
      auth: 'authentications',
      user: 'users',
    },
    cookie: {
      name: 'caliopen.web',
      'max-age': 3600,
      signed: true,
      secret: '_4+%J;_F&?#!+mR&IsYq:Xg4A*wvse',
    },
    seal: {
      secret: 'D}(2$5q)#_#yKX90,+0d5?4**a6ws8e`', // at least 32 chars
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
      config.publicPaths['/build/'] = ['dist/kotatsu/build/'];
      config.frontend.cssFiles = ['/build/style.css'];
      break;
  }

  return Object.assign({}, config, { instanceInfo });
};
