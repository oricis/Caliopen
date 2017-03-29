module.exports = (env) => {
  const config = {
    env,
    version: '0.1.0',
    publicPaths: {
      '/': ['dist/server/public/', 'public/'],
    },
    faviconPath: 'public/favicon.ico',
    frontend: {
      rootPath: '/',
      cssFiles: ['/assets/style.css'],
    },
    api: {
      prefix: '/api',
      version: 'v1',
      hostname: ['development', 'test'].indexOf(env) !== -1 ? 'localhost' : 'api.dev.caliopen.org',
      port: 31415,
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

  if (env === 'development') {
    config.publicPaths['/build/'] = ['dist/kotatsu/build/'];
    config.frontend.cssFiles = ['/build/style.css'];
  }

  return config;
};
