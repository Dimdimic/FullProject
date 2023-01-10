import {Router} from 'express';
import {register, login, getMe} from "../controllers/auth.js";
import { checkAuth } from '../utils/checkAuth.js';

const router = new Router();

// Register
//localhost:3002/api/auth/register
router.post('/register', register)

// Login
//localhost:3002/api/auth/login
router.post('/login', login)

// Get me
//localhost:3002/api/auth/me
router.get('/me', checkAuth, getMe) //checkAuth мидлвэер


export default router;