const camelcaseKeys = require('camelcase-keys');

function camelCaseReq(req, res, next) {
  req.query = camelcaseKeys(req.query, { deep: true });
  if (req.body) {
    req.body = camelcaseKeys(req.body, {
      deep: true,
    });
  }
  next();
}

module.exports = camelCaseReq;
