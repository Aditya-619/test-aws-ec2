const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json('Token not provided.');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json('User not found.');
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json('Invalid token.');
    }
};

module.exports = authMiddleware;