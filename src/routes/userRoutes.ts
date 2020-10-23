import { Router } from 'express';
import * as userController from '../controllers/user';
import auth from '../middlewares/auth';
import asyncMiddleware from '../middlewares/async';
const router = Router();

router.get('/me', auth, asyncMiddleware(userController.getOwnerProfile));
router.post('/create', asyncMiddleware(userController.createUser));
router.get(
  '/profile/:userId',
  auth,
  asyncMiddleware(userController.getUserById),
);
router.put('/', auth, asyncMiddleware(userController.update));

export default router;
