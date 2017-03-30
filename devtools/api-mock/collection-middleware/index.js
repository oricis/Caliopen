const createCollectionMiddleware = entityName => data => (req, res, next) => {
  res.data = {
    total: data.length,
    [entityName]: data,
  };

  next();
};

export default createCollectionMiddleware;
