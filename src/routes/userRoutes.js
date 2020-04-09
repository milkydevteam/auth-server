const router = require('express').Router();
const userController = require('../controllers/user');

router.get('/:userId/profile', userController.getUserById);
router.put('/:userId/update-profile', userController.update);
router.get('/all', userController.getUsers);

module.exports = router;
