const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user');
const router = express.Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// Reset route

router
    .get('/', auth, admin, userController.onGetAllUsers)
    .get('/:id', auth, admin, userController.onGetUserById)
    .post('/signup',[
        check('firstname').not().isEmpty(),
        check('lastname').not().isEmpty(),
        check('email').isEmail(),
        check('password').isLength({ min: 6 })
    ], userController.OnCreateUser)
    .get('/verify/:token', userController.verfiy)
    .post('/signin', [
        check('email', 'The email is not valid').isEmail(),
        check('password', 'min six characters').isLength({ min: 6 })
    ],userController.OnLogIn)
    .delete('/:id', auth, admin, userController.onDeleteUserById)
    

module.exports = router;