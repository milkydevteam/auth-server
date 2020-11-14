import { Router } from 'express';
import auth from '../middlewares/auth';
import authorize from '../middlewares/authorize';
import * as roleController from '../controllers/role';
import asyncMiddleware from '../middlewares/async';

const router = Router();

router.get('/', auth,authorize, asyncMiddleware(roleController.getRoles));

router.post('/create', asyncMiddleware(roleController.createRole));


export default router;
