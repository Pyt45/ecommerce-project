const router = require('express').Router();
const { check } = require('express-validator');

const productController = require('../controllers/product');
// const authRole = require('../middlewares/authRole');

// FindProductByTitle


router
    .get('/', productController.fetchProducts)
    .get('/:id', productController.fetchProductById)
    .post('/create', [
        check('title').not().isEmpty(),
        check('price').isFloat(),
        check('description').not().isEmpty(),
        check('quantity').isNumeric(),
    ] ,productController.createProduct)
    .post('/create/:id/thumbnail', productController.addThumbnailToProduct)
    .post('/create/:id/images', productController.addImagesToProduct)
    .put('/update/:id', productController.updateProduct)
    .put('/update/:id/thumbnail', productController.updateProductThumbnail)
    .put('/update/:id/images', productController.updateProductImages)
    .delete('/delete/:id', productController.deleteProduct)


module.exports = router;