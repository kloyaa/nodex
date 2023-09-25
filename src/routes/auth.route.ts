import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { checkUserOrigin } from '../_core/middlewares/check-origin.middleware';

const router = Router();

router.post('/auth/v1/login', checkUserOrigin, login as any);
router.post('/auth/v1/register', checkUserOrigin, register as any);

export default router;
