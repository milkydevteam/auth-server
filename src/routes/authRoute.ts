import { Router } from 'express';
import auth from '../middlewares/auth';
import * as authController from '../controllers/auth';
import asyncMiddleware from '../middlewares/async';

const router = Router();

router.get('/verify', asyncMiddleware(authController.verifyAccessToken));
router.post('/login', asyncMiddleware(authController.login));
router.post('/register', asyncMiddleware(authController.register));
router.put('/change-password', asyncMiddleware(authController.changePassword));
router.post('/logout', asyncMiddleware(authController.logout));

export default router;
