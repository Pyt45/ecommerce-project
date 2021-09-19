const { validationResult } = require('express-validator');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { changePermission, uploadImage } = require('../utils/ProductUtils');
const Product = require('../models/Product');
const Image = require('../models/Image');


const addThumbnailToProduct = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id });
    if (!product)
        return res.status(404).json({
            msg: 'Not Found'
        });

    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        const filename = files.thumbnail.name;
        const extention = filename.split('.')[1];
        const imgUploadPath = path.join(__dirname, '../uploads') + '/' + product._id + '.' + extention;
        const imgPath = files.thumbnail.path;
        const rawData = fs.readFileSync(imgPath);

        fs.writeFile(imgUploadPath, rawData, async (err) => {
            if (err) {
                return res.status(500).send('Internal server error');
            }
            await changePermission(imgUploadPath);
            product.thumbnail = '/uploads/' + product._id + '.' + extention;

            await product.save();
            return res.status(200).json({
                success: true,
                productInfo: product
            })
        })
    });
};

const addImagesToProduct = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id });
    if (!product)
        return res.status(404).json({
            msg: 'Not Found'
        });
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        console.log(Object.keys(files));
        for (let i = 0; i < Object.keys(files).length; i++) {
            const filename = files[Object.keys(files)[i]].name;
            const extention = filename.split('.')[1];
            const hashPath = product._id + '-' + i + '.' + extention;
            const imgUploadPath = path.join(__dirname, '../uploads') + '/' + hashPath;
            const imgPath = files[Object.keys(files)[i]].path;

            const rawData = fs.readFileSync(imgPath);

            try {
                const image = await uploadImage(imgUploadPath, rawData, i, extention, product);
                product.images.push(image);
            } catch(err) {
                console.log(err);
            }
        }
        
        await product.save()

        return res.status(200).json({
            success: true,
            productInfo: product
        })
    })
};


const createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
    return res.status(400).json(errors);
    let { title, price, description, quantity } = req.body;
    
    try {
        const product = await Product.createProduct(title, price, description, quantity);
        // console.log(imgUrl);
        return res.status(200).json({
            success: true,
            productInfo: product,
        })
    }catch(err) {
        console.log(err.message);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};

const fetchProducts = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.getAllProducts(skip, limit);
        return res.status(200).json(products);
    } catch(err) {
        return res.status(500).send('Internal server error');
    }
};
const fetchProductByTitle = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const title = req.query.title || "";

        const products = await Product.fetchByTitle(title, skip, limit);
        return res.status(200).json(products);
    } catch(err) {
        return res.status(500).send('Internal server error');
    }
};


const deleteProduct = async (req, res) => {};

const updateProduct = async (req, res) => {};
const updateProductThumbnail = async (req, res) => {};
const updateProductImages = async (req, res) => {};


module.exports = {
    fetchProducts,
    fetchProductByTitle,
    createProduct,
    updateProduct,
    updateProductThumbnail,
    updateProductImages,
    deleteProduct,
    addThumbnailToProduct,
    addImagesToProduct,
}