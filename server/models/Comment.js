const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const User = require('./User');

const CommentSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, '')
        },
        content: String,
        rating: Number,
        user: { type: mongoose.Schema.Types.String, ref: 'User' }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Comment', CommentSchema);