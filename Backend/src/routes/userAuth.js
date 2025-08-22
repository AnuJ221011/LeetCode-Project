const express = require('express');
const { register, login, logout, adminRegister } = require('../controllers/userAuthent');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const authRouter = express.Router();


authRouter.post('/register', register); //user register
authRouter.post('/admin/register', adminMiddleware, adminRegister); //admin register
authRouter.post('/login', login); //user login
authRouter.post('/logout', userMiddleware, logout); // user logout using Redis middleware

// authRouter.get('/profile', getProfile);

module.exports = authRouter;