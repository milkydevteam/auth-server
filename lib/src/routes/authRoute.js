"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = require("../controllers/auth");
const async_1 = require("../middlewares/async");
const router = express_1.Router();
router.get('/verify', async_1.default(authController.verifyAccessToken));
router.post('/login', async_1.default(authController.login));
router.post('/register', async_1.default(authController.register));
router.put('/change-password', async_1.default(authController.changePassword));
router.post('/logout', async_1.default(authController.logout));
exports.default = router;
//# sourceMappingURL=authRoute.js.map