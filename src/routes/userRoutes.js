const router = require('express').Router();
const userController = require('../controllers/user');
const auth = require('../middlewares/auth');

router.get('/profile', auth, userController.getOwnerProfile);

router.get('/other-profile/:userId', auth, userController.getUserById);
router.put('/update-profile', userController.update);
router.get('/all', userController.getUsers);

module.exports = router;
