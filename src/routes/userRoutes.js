const router = require('express').Router();
const userController = require('../controllers/user');

router.get('/{userId}/profile', userController.getUserById);
router.put('/{userId}/update-profile', userController.update);

module.exports = router;
