const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Order = require('./Order');

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
            default: 'User'
        },
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
    },
    {
        timestamps: true
    }
);

UserSchema.statics.CreateUser = async function(firstname, lastname, email, password) {
    try {
        const user = await this.create({firstname, lastname, email, password});
        return user;
    }catch(err) {
        throw err;
    }
}

UserSchema.statics.DeleteUserById = async function(id) {
    try {
        const rsl = await this.deleteOne({ _id: id });
        return rsl;
    }catch(err) {
        throw err;
    }
}

UserSchema.statics.GetAllUsers = async function(id) {
    try {
        const users = await this.find().select(['-password', '-role', '-active']);
        return users;
    }catch(err) {
        throw err;
    }
}

UserSchema.statics.GetUserById = async function(id) {
    try {
        const user = await this.findOne({ _id: id }).select(['-password', '-role', '-active']);
        return user;
    }catch(err) {
        throw err;
    }
}


module.exports = mongoose.model('User', UserSchema);