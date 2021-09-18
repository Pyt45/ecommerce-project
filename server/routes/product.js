const router = require('express').Router();
const { check } = require('express-validator');

const productController = require('../controllers/product');
// const authRole = require('../middlewares/authRole');
// addProduct
// deleteProduct
// updateProduct
// getAllProduct
// getProductById

// [
//     check('title').not().isEmpty(),
//     check('price').isFloat(),
//     check('description').not().isEmpty(),
//     check('quantity').isNumeric(),
//     check('thumbnail').not().isEmpty()
// ],

router
    .get('/', productController.fetchProduct)
    .get('/:id', productController.fetchProductById)
    .post('/create', productController.createProduct)
    .put('/update/:id', productController.updateProduct)
    .delete('/delete/:id', productController.deleteProduct)


module.exports = router;