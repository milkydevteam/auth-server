const router = require('express').Router();
const authController = require('../controllers/auth');

const auth = require('../middlewares/auth');

router.get('/verify', authController.verifyAccessToken);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.put('/change-password', auth, authController.changePassword);
router.post('/logout', authController.logout);

module.exports = router;
