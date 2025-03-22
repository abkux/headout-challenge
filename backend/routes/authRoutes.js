import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();
// handle registeration
router.post('/register', register);
// handle login
router.post('/login', login);

export default router;
