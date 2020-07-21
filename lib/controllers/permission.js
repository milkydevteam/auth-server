"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByRole = exports.getPermissions = exports.updatePermission = exports.addPermission = void 0;
const permissionService = require("../services/permission");
function addPermission(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, backendKey: { method, routePath }, frontendKey, } = req.body;
        const role = yield permissionService.addPermission({
            name,
            backendKey: { method, routePath },
            frontendKey,
        });
        return res.send({ status: 1, result: role });
    });
}
exports.addPermission = addPermission;
function updatePermission(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { permissionId } = req.params;
        const updateFields = req.body;
        const updatedPermission = yield permissionService.updatePermission(permissionId, updateFields);
        return res.send({ status: 1, result: updatedPermission });
    });
}
exports.updatePermission = updatePermission;
function getPermissions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { search, fields, offset, limit, sort } = req.query;
        const query = {};
        query.query = {};
        if (search)
            query.search = search;
        if (fields)
            query.fields = fields.split(',');
        if (offset)
            query.offset = parseInt(offset, 10);
        if (limit)
            query.limit = parseInt(limit, 10);
        if (sort)
            query.sort = sort.split(',');
        Object.keys(req.query)
            .filter(q => ['search', 'fields', 'offset', 'limit', 'sort'].indexOf(q) === -1)
            .forEach(q => {
            query.query[q] = ['true', 'false'].includes(req.query[q])
                ? JSON.parse(req.query[q])
                : req.query[q];
        });
        const { permissions, count } = yield permissionService.findAll(query);
        return res.send({
            status: 1,
            result: { permissions, metadata: { total: count } },
        });
    });
}
exports.getPermissions = getPermissions;
function getPermissionsByRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roleId } = req.account;
        const permissions = yield permissionService.getPermissionsByRole(roleId);
        return res.send({ status: 1, result: permissions });
    });
}
exports.getPermissionsByRole = getPermissionsByRole;
//# sourceMappingURL=permission.js.map