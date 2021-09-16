const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, "")

        },
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        active: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', UserSchema);