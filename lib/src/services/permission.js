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
exports.getPermissionsByRole = exports.updatePermission = exports.addPermission = exports.isValidPermissions = exports.findAll = void 0;
const CustomError = require('../constants/errors/CustomError');
const errorCodes = require('../constants/errors/code');
const Permission = require('../models/permission');
const Role = require('../models/role');
function isValidPermissions(permissionIds) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const permissionId of permissionIds) {
            const permission = yield Permission.findById(permissionId);
            if (!permission)
                return false;
        }
        return true;
    });
}
exports.isValidPermissions = isValidPermissions;
function addPermission({ name, backendKey, frontendKey }) {
    return __awaiter(this, void 0, void 0, function* () {
        const $or = [];
        if (frontendKey) {
            $or.push({ frontendKey });
        }
        if (backendKey) {
            const { method, routePath } = backendKey;
            $or.push({
                'backendKey.method': method,
                'backendKey.routePath': routePath,
            });
        }
        const isPermissionExist = yield Permission.findOne({ $or });
        if (isPermissionExist)
            throw new CustomError(errorCodes.BAD_REQUEST, 'Permission is exists');
        const permission = yield Permission.create({
            name,
            backendKey: backendKey
                ? { method: backendKey.method, routePath: backendKey.routePath }
                : undefined,
            frontendKey,
        });
        return permission;
    });
}
exports.addPermission = addPermission;
function updatePermission(permissionId, updateFields) {
    return __awaiter(this, void 0, void 0, function* () {
        const permission = yield Permission.findById(permissionId);
        if (!permission)
            throw new CustomError(errorCodes.BAD_REQUEST, 'Permission is not exists');
        const { backendKey, frontendKey } = updateFields;
        const { method, routePath } = backendKey;
        if (backendKey) {
            const isPermissionExist = yield Permission.findOne({
                'backendKey.method': method,
                'backend.routePath': routePath,
            });
            if (isPermissionExist)
                throw new CustomError(errorCodes.BAD_REQUEST, 'Permission is exist');
        }
        if (frontendKey) {
            const isPermissionExist = yield Permission.findOne({
                frontendKey,
            });
            if (isPermissionExist)
                throw new CustomError(errorCodes.BAD_REQUEST, 'Permission is exist');
        }
        const updatedPermission = yield Permission.findByIdAndUpdate(permissionId, updateFields, { new: true });
        return updatedPermission;
    });
}
exports.updatePermission = updatePermission;
function getPermissionsByRole(roleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const role = yield Role.findById(roleId);
        const { permissionIds } = role;
        const permissions = yield Permission.find({ _id: { $in: permissionIds } });
        return permissions.map(permission => permission.frontendKey);
    });
}
exports.getPermissionsByRole = getPermissionsByRole;
exports.findAll = (condition) => {
    // TODO
    return {
        permissions: [],
        count: 1,
    };
};
//# sourceMappingURL=permission.js.map