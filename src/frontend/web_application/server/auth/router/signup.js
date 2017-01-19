const FORM_PROPS = { action: '/auth/signup', method: 'POST' };

const getDevInfos = config => ({
  version: config.version,
});

const getFormParam = (req) => {
  const form = Object.assign({}, FORM_PROPS);

  if (req.originalUrl.indexOf('?') !== -1) {
    form.action += `?${req.originalUrl.split('?')[1]}`;
  }

  return form;
};

const createSignupRouting = (router) => {
  router.get('/signup', (req, res) => {
    return res.render('signup.component', { form: getFormParam(req), devInfos: getDevInfos(req.config) });
  });
};

module.exports = createSignupRouting;
