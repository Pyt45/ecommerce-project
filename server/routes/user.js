const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user');
const router = express.Router();

router
    .get('/', userController.onGetAllUsers)
    .get('/:id', userController.onGetUserById)
    .post('/signup', userController.OnCreateUser)
    .post('/signin', [
        check('firstname').notEmpty(),
        check('lastname').notEmpty(),
        check('email').isEmail(),
        check('password').isLength({ min: 6 })
    ], userController.OnLogIn)
    .delete('/:id', userController.onDeleteUserById)
    

module.exports = router;