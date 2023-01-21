import { Router } from 'express';
import { login } from '../controllers/login.js';
import { signUp } from '../controllers/signUp.js';
import { validateSchema } from '../middlewares/schemaMiddleware.js';
import { loginSchema } from '../schemas/loginSchema.js';
import { signUpSchema } from '../schemas/signUpSchema.js';

const router = Router();

router.post('/login', validateSchema(loginSchema), login);

router.post('/cadastro', validateSchema(signUpSchema), signUp);

export default router;