import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
const router = Router();

router.post('/auth/v1/login', login as any);
router.post('/auth/v1/register', register as any);

export default router;
