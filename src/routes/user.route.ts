import { Router } from 'express';
import { createProfile, getProfileByAccessToken } from '../controllers/user.controller';
import { checkUserOrigin } from '../_core/middlewares/check-origin.middleware';
import { isAuthenticated } from '../_core/middlewares/jwt.middleware';

const router = Router();

router.post('/user/v1/profile', checkUserOrigin, isAuthenticated, createProfile as any);
router.get('/user/v1/profile', checkUserOrigin, isAuthenticated, getProfileByAccessToken as any);

export default router;
