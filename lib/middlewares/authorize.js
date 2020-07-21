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
const async_1 = require("./async");
// const Permission = require('../models/permission');
function authorize(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { account } = req;
        const { method, route: { path: routePath }, } = req;
        return next();
        // const permission = await Permission.findOne({
        //   backendKey: { method, routePath },
        // });
        // const isRoleContainPermission = await roleService.isPermissionBelongsToRole(
        //   account.roleId,
        //   permission._id,
        // );
        // if (isRoleContainPermission) return next();
        // throw new CustomError(codes.FORBIDDEN);
    });
}
const asyncAuthorize = async_1.default(authorize);
exports.default = asyncAuthorize;
//# sourceMappingURL=authorize.js.map