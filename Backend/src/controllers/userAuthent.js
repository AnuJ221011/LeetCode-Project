const redisClient = require('../config/redis');
const Submission = require('../models/submission');
const User = require('../models/user');
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        console.log('Calling auth controller');
        console.log('Request body:', req.body); 
        //validate the data;
        validate(req.body);

        const {firstName, emailId, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        const user = await User.create(req.body);
        const token = jwt.sign({_id:user._id, role:'user',emailId:emailId}, process.env.JWT_SECRET, {expiresIn: "1h"});

        // data to send back to frontend
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }

        res.cookie('token', token, {maxAge:60*60*1000});
        res.status(201).json({
            user:reply,
            message:'User Registered Successfully'
        });
        
    }
    catch (error) {
        console.log('Error in auth controller');
        res.status(400).send("Error :" + error);
    }
}

const login = async (req, res) => {
    try {
        const {emailId, password} = req.body;

        if(!emailId || !password) {
            throw new Error("Invalid Credentials");
        }

        const user = await User.findOne({emailId});
        if(!user) {
            throw new Error("User Not Found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new Error("Invalid Credentials");
        }

        // data to send back to frontend
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }

        const token = jwt.sign({_id:user._id, role:user.role, emailId:emailId}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.cookie('token', token, {maxAge:60*60*1000});
        res.status(201).json({
            user:reply,
            message:'User Logged In Successfully'
        });
    }
    catch (error) {
        res.status(401).send("Error :" + error);
    }
}

const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);
        //Token add kr dunga Redis ke blockList me
        // Cookies ko clear kr dena

        res.cookie('token', null, {expires: new Date(Date.now())});
        res.status(201).send('User Logged Out Successfully');

    }
    catch (error) {
        res.status(503).send("Error :" + error);
    }
}

const adminRegister = async (req, res) => {
    try {
        //validate the data;
        validate(req.body);

        const {firstName, emailId, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        // req.body.role = 'admin';  // admin dono ko register kr skte hain

        const user = await User.create(req.body);
        const token = jwt.sign({_id:user._id, role:user.role ,emailId:emailId}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.cookie('token', token, {maxAge:60*60*1000});
        res.status(201).send('Admin Registered Successfully');
        
    }
    catch (error) {
        console.log('Error in auth controller');
        res.status(400).send("Error :" + error);
    }
}

const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;

        //userSchema se delete
        await User.findByIdAndDelete(userId);
        
        //submission se delete
        await Submission.deleteMany({userId});

        res.status(200).send('Profile Deleted Successfully');
    }
    catch(err) {
        res.status(500).send("Error: " + err);
    }
}

module.exports = {
    register,
    login,
    logout,
    adminRegister,
    deleteProfile
};