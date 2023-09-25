import { Router } from 'express';
import { createProfile } from '../controllers/user.controller';
import { checkUserOrigin } from '../_core/middlewares/check-origin.middleware';
import { isAuthenticated } from '../_core/middlewares/jwt.middleware';

const router = Router();

router.post('/user/v1/profile', checkUserOrigin, isAuthenticated, createProfile as any);

export default router;
