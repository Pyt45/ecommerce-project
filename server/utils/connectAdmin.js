const User = require('../models/User')
const bcrypt = require('bcryptjs');
const generateToken = require('./generateToken');

const connectAdmin = async () => {
    const Admin = await User.findOne({ role: 'Admin' });

    if (Admin)
        return {
            msg: 'Admin alredy there'
        };

    const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash('admin1234@', salt);
    const admin = new User({
        firstname: 'admin',
        lastname: 'admin',
        email: 'admin@gmail.com',
        password: hash,
        active: true,
        role: 'Admin'
    });

    const payload = {
        userID: admin._id
    };

    const token = generateToken(payload);
    console.log(token);

    await admin.save();
}

module.exports = connectAdmin;