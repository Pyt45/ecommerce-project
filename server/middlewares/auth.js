require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (header) {
            const token = header.split(" ")[1];
            if (!token)
            {
                return res.status(400).json({
                    msg: 'No token provided'
                })
            }
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.payload = payload;
            return next();
        }
        return res.status(400).json({
            msg: 'Header auth not seted'
        })
    }catch(err) {
        throw err;
    }
}

module.exports = auth;