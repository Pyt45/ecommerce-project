const User = require("../models/User");

const authUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const payload = req.payload;

        if (id != payload.userID)
            return res.status(400).json({
                msg: 'Auth failed'
            });

        const user = await User.findOne({ _id: payload.userID });
        if (!user)
            return res.status(400).json({
                msg: 'User not found'
            });
        else
            return next();

    } catch(err) {
        throw err;
    }
}

module.exports = authUser;