const express = require('express');
const { register, login, logout, adminRegister,deleteProfile } = require('../controllers/userAuthent');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const authRouter = express.Router();


authRouter.post('/register', register); //user register
authRouter.post('/admin/register', adminMiddleware, adminRegister); //admin register
authRouter.post('/login', login); //user login
authRouter.post('/logout', userMiddleware, logout); // user logout using Redis middleware
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);
authRouter.get('/check', userMiddleware, (req, res) => { // to check if user is authenticated
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id: req.result._id,
        role: req.result.role,
    }

    res.status(200).json({
        user: reply,
        message: 'User is Authenticated'
    });
});

// authRouter.get('/profile', getProfile);

module.exports = authRouter;