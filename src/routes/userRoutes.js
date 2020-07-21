const router = require('express').Router();
const userController = require('../controllers/user');
const auth = require('../middlewares/auth');

router.get('/me', auth, userController.getOwnerProfile);
router.get('/profile/:userId', auth, userController.getUserById);
router.put('/', userController.update);

module.exports = router;
