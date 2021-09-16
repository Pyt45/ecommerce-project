require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
}

module.exports = generateToken;