const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Token is not present");
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const {_id} = payload;

        if(!_id) {
            throw new Error("Invalid Token");
        }
        
        const result = await User.findById(_id);
        if(!result) {
            throw new Error("User Doesn't Exist");
        }

        if(payload.role !== 'admin') {
            throw new Error("You are not an admin");
        }

        //Redis ke blockList me present hai ki nhi

        const isBlocked = await redisClient.exists(`token:${token}`);

        if(isBlocked) {
            throw new Error("Invalid Token");
        }

        req.result = result;
        next();
        
    } catch (error) {
        res.status(401).send("Error :" + error.message);
    }
}

module.exports = adminMiddleware;