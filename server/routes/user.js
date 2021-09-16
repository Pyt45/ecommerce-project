const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user');
const router = express.Router();
const auth = require('../middlewares/auth');

router
    .get('/', auth, userController.onGetAllUsers)
    .get('/:id', userController.onGetUserById)
    .post('/signup',[
        check('firstname').not().isEmpty(),
        check('lastname').not().isEmpty(),
        check('email').isEmail(),
        check('password').isLength({ min: 6 })
    ], userController.OnCreateUser)
    .get('/verify/:token', userController.verfiy)
    .post('/signin', [
        check('email').isEmail(),
        check('password').isLength({ min: 6 })
    ],userController.OnLogIn)
    .delete('/:id', userController.onDeleteUserById)
    

module.exports = router;