import express from 'express'
import { loginUser, registerUser } from '../controller/auth.controller.js';
const router = express.Router();

//user registration
router.route('/register').post(registerUser);

//login
router.route('/login').post(loginUser);

export default router