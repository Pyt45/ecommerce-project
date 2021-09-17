require('dotenv').config();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');


sgMail.setApiKey(process.env.API_KEY);

const onGetAllUsers = async (req, res) => { 
    try {
        const users = await User.GetAllUsers();
        return res.status(200).json(users);
    }catch(err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
};

const onGetUserById = async (req, res) => {
    try {
        const user = await User.GetUserById(req.params.id);
        return res.status(200).json(user);
    }catch(err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
};

const OnCreateUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(400).json(errors);
    const { firstname, lastname, email, password } = req.body;
    try {
        const oldUser = await User.findOne({ email: email })
        if (oldUser) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Email Alredy Exist'
                    }
                ]
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        let user = await User.CreateUser(firstname, lastname, email, hash);
        user = await User.GetUserById(user._id);
        
        const payload = {
            userID: user._id
        };
        const token = generateToken(payload);
        const url = `${req.protocol}://${req.hostname}:${process.env.PORT}/users/verify/${token}`;

        sgMail.send({
            from: 'mohammed.ymik@outlook.com',
            to: email,
            subject: 'Verify your account',
            html: `Click <a href=${url}>here</a> to verify your account`
        });

        return res.status(200).json({
            success: true,
            userInfo: user,
            token: token,
            emailVerfication: `we sent u an email to ${email}. Please verify your account`
        })

    } catch(err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
};

const OnLogIn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json(errors);
    const { email, password } = req.body;
    try {
        const user = User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                msg: 'Invalid email or password'
            })
        }
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.status(400).json({
                msg: 'Invalid email or password'
            })
        }
        if (!user.active) {
            return res.status(400).json({
                msg: 'Please make sure your account is activated'
            })
        }
        return res.status(400).json({
            msg: 'Logged in succesfuly'
        })  
    } catch(err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
};

const onDeleteUserById = async (req, res) => {
    try {
        const rsl = await User.DeleteUserById(req.params.id);
        return res.status(400).json({
            rsl
        })
    }catch(err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
};

const verfiy = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({
                msg: 'No token found'
            })
        }
        const payload = await jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: payload.userID });
        if (!user) {
            return res.status(400).json({
                msg: 'User does not exist'
            })
        }
        user.active = true;
        await user.save();
        return res.status(200).json({
            msg: 'Account is activated'
        });
    }catch(err) {
        console.log(err.message);
        res.status(500).send('server error');
    } 
}

module.exports = {
    onGetAllUsers,
    onGetUserById,
    OnCreateUser,
    OnLogIn,
    onDeleteUserById,
    verfiy
}
