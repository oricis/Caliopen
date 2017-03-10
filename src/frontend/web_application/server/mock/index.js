const path = require('path');
const swagger = require('swagger-express-middleware');

const createMockMiddleware = (app) => {
  const myDB = new swagger.MemoryDataStore();
  myDB.save([
    new swagger.Resource('/api/v1/tags', '/foo', { name: 'foo' }),
    new swagger.Resource('/api/v1/tags', '/bar', { name: 'bar' }),
  ]);

  swagger(path.resolve(`${__dirname}/../../../../../doc/api/swagger.json`), app, (err, middleware) => {
    app.use(
      middleware.metadata(),
      middleware.CORS(),
      middleware.files(),
      middleware.parseRequest(),
      middleware.validateRequest(),
      middleware.mock(myDB)
    );
  });

  app.get('/api/v1/tags', (req, res) => {
    myDB.getCollection(req.route.path, (err, resources) => {
      res.send({
        total: resources.length,
        tags: resources.map((resource, key) => Object.assign({ type: 'user', tag_id: key }, resource.data)),
      });
    });
  });
};

module.exports = createMockMiddleware;
