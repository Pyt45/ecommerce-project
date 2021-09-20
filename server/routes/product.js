const router = require('express').Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const productController = require('../controllers/product');
// const authRole = require('../middlewares/authRole');

// FindProductByTitle


router
    .get('/', auth, productController.fetchProducts)
    .get('/search', auth, productController.fetchProductByTitle)
    .post('/create', auth, admin, [
        check('title').not().isEmpty(),
        check('price').isFloat(),
        check('description').not().isEmpty(),
        check('quantity').isNumeric(),
    ] ,productController.createProduct)
    .post('/create/:id/thumbnail', auth, admin, productController.addThumbnailToProduct)
    .post('/create/:id/images', auth, admin, productController.addImagesToProduct)
    .put('/update/:id', auth, admin, [
        check('title').not().isEmpty(),
        check('price').isFloat(),
        check('description').not().isEmpty(),
        check('quantity').isNumeric()
    ], productController.updateProduct)
    .patch('/update/:id/thumbnail', auth, admin, productController.updateProductThumbnail)
    .put('/update/:id/images', auth, admin, productController.updateProductImages)
    .delete('/delete/:id', auth, admin, productController.deleteProduct)


module.exports = router;