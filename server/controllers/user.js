require('dotenv').config();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
// const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


// sgMail.setApiKey(process.env.API_KEY);

// const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     service: process.env.SERVICE,
//     port: 587,
//     secure: true,
//     auth: {
//         user: process.env.USER,
//         pass: process.env.PASS
//     }
// });

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
        if (!user)
            return res.status(400).json({
                msg: 'User Not Found'
            })
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
                        param: 'Email',
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

        /*sgMail.send({
            from: 'mohammed.ymik@outlook.com',
            to: email,
            subject: 'Verify your account',
            html: `Click <a href=${url}>here</a> to verify your account`
        });*/

        return res.status(200).json({
            success: true,
            userInfo: user,
            token: token,
            emailVerfication: `We sent you an email to ${email}. Please verify your account`
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
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Invalid email or password'
                    }
                ]
            })
        }
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Invalid email or password'
                    }
                ]
            })
        }
        if (!user.active) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Please make sure that your account has been validated'
                    }
                ]
            })
        }
        const payload = {
            userID: user._id
        };
        const token = generateToken(payload);

        return res.status(200).json({
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                active: user.active,
                role: user.role
            },
            token: token
        })  
    } catch(err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
};

const onDeleteUserById = async (req, res) => {
    try {
        const rsl = await User.DeleteUserById(req.params.id);
        return res.status(200).json({
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
                errors: [
                    {
                        msg: 'No Token Found'
                    }
                ]
            })
        }
        const payload = await jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: payload.userID });
        if (!user) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'User does not exist'
                    }
                ]
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

const OnUpdateUserInfo = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json(errors);
    const { firstname, lastname, email } = req.body;
    const oldEmail = email;
    try {
        const id = req.params.id;
        console.log(id);
        let user = await User.findOne({ _id: id });
        user = await User.updateOne({ _id: id }, { firstname: firstname, lastname: lastname, email: email});
        user = await User.findOne({ _id: id });

        const payload = {
            userID: user._id
        }

        const token = generateToken(payload);
        const url = `${req.protocol}://${req.hostname}:${process.env.PORT}/users/verify/${token}`;
        if (oldEmail != user.email)
            return res.status(200).json({
                emailVerfication: 'we sent u an email to verify ur account',
                user: user
            });
        /*sgMail.send({
            from: 'mohammed.ymik@outlook.com',
            to: email,
            subject: 'Verify your account',
            html: `Click <a href=${url}>here</a> to verify your account`
        });*/


        return res.status(200).json({
            user: user,
        });
    } catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error1')
    }
};
const OnChangePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json(errors);
    let { password, newPassword } = req.body;
    try {
        const id = req.params.id;
        let user = await User.findOne({ _id: id });
        const matched = await bcrypt.compare(password, user.password);

        if (!matched)
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Incorrect password',
                        param: 'password'
                    }
                ]
            });

            const salt = await bcrypt.genSalt(10);
            newPassword = await bcrypt.hash(newPassword, salt);
        
        await User.updateOne({ _id: id }, { password: newPassword });

        return res.status(200).json({
            msg: 'success'
        });
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
};

const OnResetEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json(errors);
    const { email } = req.body;
    try {
        const id = req.params.id;
        const payload = {
            userID: id
        };

        const token = generateToken(payload);
        const url = `${req.protocol}://${req.hostname}:${process.env.PORT}/users/reset/email/${token}`;
        /*sgMail.send({
            from: 'mohammed.ymik@outlook.com',
            to: email,
            subject: 'Resetyour account',
            html: `Click <a href=${url}>here</a> to reset your email`
        });*/
        return res.status(200).json({
            url: url
        });

    }catch(err) {
        return res.status(500).send('Internal server error');
    }
};

module.exports = {
    onGetAllUsers,
    onGetUserById,
    OnCreateUser,
    OnLogIn,
    onDeleteUserById,
    verfiy,
    OnUpdateUserInfo,
    OnChangePassword,
    OnResetEmail
}
