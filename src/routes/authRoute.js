const router = require('express').Router();
const authController = require('../controllers/auth');

router.get('/verify', authController.verifyAccessToken);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/change-password', authController.changePassword);
router.post('/logout', authController.logout);

module.exports = router;
