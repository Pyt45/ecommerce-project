const router = require('express').Router();
const { check } = require('express-validator');

const auth = require('../middlewares/auth');
const admin = require('../middlewares/auth');

const categoryController = require('../controllers/category');

router
    .get('/categories', categoryController.OnGetAllCategory)
    .get('/category/:slug', categoryController.OnGetCategoryBySlug)
    .post('/category/create', auth, admin, [
        check('name', 'invalid category name').not().isEmpty()
    ], categoryController.OnCreateCategory)
    .put('/category/update/:slug', auth, admin, [
        check('name').not().isEmpty()
    ], categoryController.OnUpdateCategory)
    .delete('/category/delete/:slug', auth, admin, categoryController.OnDeleteCategory)

module.exports = router;