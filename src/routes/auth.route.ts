import { Router } from 'express'
import { login } from '../controllers/auth.controller'
import { checkUserOrigin } from '../_core/middlewares/check-origin.middleware'

const router = Router()

router.post('/auth/v1/login', checkUserOrigin, login);

export default router