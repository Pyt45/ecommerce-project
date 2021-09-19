require('dotenv').config();
const User = require('../models/User');

const admin = async (req, res, next) => {
    const payload = req.payload;

    const user = await User.findOne({ _id: payload.userID });

    if (!user)
        return res.status(404).json({
            msg: 'User not found'
        })
    if (user.role === 'Admin')
        return next();
    else
        return res.status(400).json({
            msg: 'Auth failed'
        });
}

module.exports = admin;