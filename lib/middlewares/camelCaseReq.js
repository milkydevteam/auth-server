"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelcaseKeys = require("camelcase-keys");
function camelCaseReq(req, res, next) {
    req.query = camelcaseKeys(req.query, { deep: true });
    if (req.body) {
        req.body = camelcaseKeys(req.body, {
            deep: true,
        });
    }
    next();
}
exports.default = camelCaseReq;
//# sourceMappingURL=camelCaseReq.js.map