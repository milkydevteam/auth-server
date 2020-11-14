import { Router } from 'express';
import auth from '../middlewares/auth';
import * as authController from '../controllers/auth';
import asyncMiddleware from '../middlewares/async';

const router = Router();

router.get('/verify', auth, asyncMiddleware(authController.verifyAccessToken));
router.get('/license',  asyncMiddleware(authController.getLicense));
router.get(
  '/refresh-token',
  auth,
  asyncMiddleware(authController.refreshToken),
);
router.post('/login', asyncMiddleware(authController.login));
router.post('/register', asyncMiddleware(authController.register));
router.put(
  '/change-password',
  auth,
  asyncMiddleware(authController.changePassword),
);
router.post('/logout', auth, asyncMiddleware(authController.logout));

export default router;
