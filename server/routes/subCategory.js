const router = require('express').Router();
const { check } = require('express-validator');
const subCategoryController = require('../controllers/subCategory');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router
    .get('/subCategories', subCategoryController.onGetAllSubCategory)
    .get('/subCategory/:slug', subCategoryController.onGetSubCategoryBySlug)
    .post('/subCategory/create', auth, admin, [
        check('name').not().isEmpty()
    ], subCategoryController.onCreateSubCategory)
    .put('/subCategory/update/:slug', auth, admin, [
        check('name').not().isEmpty()
    ], subCategoryController.onUpdateSubCategory)
    .delete('/subCategory/delete/:slug', auth, admin, subCategoryController.onDeleteSubCategory)

module.exports = router;
