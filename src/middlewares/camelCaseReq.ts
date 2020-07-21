import * as camelcaseKeys from 'camelcase-keys';

export default function camelCaseReq(req, res, next) {
  req.query = camelcaseKeys(req.query, { deep: true });
  if (req.body) {
    req.body = camelcaseKeys(req.body, {
      deep: true,
    });
  }
  next();
}
