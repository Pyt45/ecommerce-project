const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
    const erros = validationResult(req);

    if (!erros.isEmpty())
        res.status(400).json(errors);
    const { firstname, lastname, email, password } = req.body;
    try {
        const oldUser = await User.findOne({ email: email })
        if (oldUser) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'User Alredy Exist'
                    }
                ]
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.CreateUser(firstname, lastname, email, hash);

        return res.status(200).json({
            success: true,
            userInfo: user
        })

    } catch(err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
};

const OnLogIn = (req, res) => { };

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

module.exports = {
    onGetAllUsers,
    onGetUserById,
    OnCreateUser,
    OnLogIn,
    onDeleteUserById,
}
