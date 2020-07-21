"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = require("../controllers/user");
const auth_1 = require("../middlewares/auth");
const async_1 = require("../middlewares/async");
const router = express_1.Router();
router.get('/me', auth_1.default, async_1.default(userController.getOwnerProfile));
router.get('/profile/:userId', auth_1.default, async_1.default(userController.getUserById));
router.put('/', auth_1.default, async_1.default(userController.update));
exports.default = router;
//# sourceMappingURL=userRoutes.js.map