const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user');
const router = express.Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const authUser = require('../middlewares/authUser');

// Reset route

router
    .get('/', auth, admin, userController.onGetAllUsers)
    .get('/:id', auth, admin, userController.onGetUserById)
    .post('/signup',[
        check('firstname', 'firstname is empty').not().isEmpty(),
        check('lastname', 'lastname is empty').not().isEmpty(),
        check('email', 'invalid email').isEmail(),
        check('password', 'min six characters').isLength({ min: 6 })
    ], userController.OnCreateUser)
    .get('/verify/:token', userController.verfiy)
    .post('/signin', [
        check('email', 'invalid email').isEmail(),
        check('password', 'min six characters').isLength({ min: 6 })
    ], userController.OnLogIn)
    .put('/:id', auth, authUser, [
        check('firstname', 'firstname is empty').not().isEmpty(),
        check('lastname', 'lastname is empty').not().isEmpty(),
        check('email', 'invalid email').isEmail()
    ], userController.OnUpdateUserInfo)
    .patch('/:id/changePAssword', auth, authUser, [
        check('password').isLength({ min: 6 }),
        check('newPassword').isLength({ min: 6 })
    ], userController.OnChangePassword)
    .post('/reset/:id', auth, authUser, [
        check('email', 'invalid email').isEmail()
    ], userController.OnResetEmail)
    .delete('/:id', auth, admin, userController.onDeleteUserById)
    

module.exports = router;