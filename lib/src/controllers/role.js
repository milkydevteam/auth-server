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
exports.getRoles = exports.updateRole = exports.addRole = void 0;
const RoleService = require("../services/role");
function addRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = req.body;
        const role = yield RoleService.addRole(name);
        return res.send({ status: 1, result: role });
    });
}
exports.addRole = addRole;
function updateRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roleId } = req.params;
        const updateFields = req.body;
        const updatedRole = yield RoleService.updateRole(roleId, updateFields);
        return res.send({ status: 1, result: updatedRole });
    });
}
exports.updateRole = updateRole;
function getRoles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code } = req.query;
        let role = {};
        let count = 0;
        return res.send({
            status: 1,
            result: { role, metadata: { total: count } },
        });
    });
}
exports.getRoles = getRoles;
//# sourceMappingURL=role.js.map