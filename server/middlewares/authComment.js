const User = require('../models/User');
const Comment = require('../models/Comment');


const authComment = (req, res, next) => {
    try {
        const payload = req.payload;
        const { id } = req.body;

        const user = await User.findOne({ _id: payload.userID });
        const comment = await Comment.findOne({ _id: id });
        if (!user || !comment)
            return res.status(404).json({
                msg: 'not found'
            });
        if (user.role === 'Admin' || comment.user === user._id)
            return next();
        return res.status(400).json({
            msg: 'Auth failed'
        });
    }catch(err) {
        console.log(err);
        throw err;
    }
};

module.exports = authComment;

// comment.user == user._id