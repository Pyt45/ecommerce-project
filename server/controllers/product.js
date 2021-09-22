const { validationResult } = require('express-validator');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { changePermission, uploadImage, deleteFile } = require('../utils/ProductUtils');
const Product = require('../models/Product');
const Image = require('../models/Image');


const addThumbnailToProduct = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id });
    if (!product)
        return res.status(404).json({
            msg: 'Product Not Found'
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

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

const addImagesToProduct = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id });
    if (!product)
        return res.status(404).json({
            msg: 'Product not found'
        });
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        console.log(Object.keys(files));
        for (let i = 0; i < Object.keys(files).length; i++) {
            const filename = files[Object.keys(files)[i]].name;
            const extention = filename.split('.')[1];
            const date = new Date().toLocaleString().split(', ')[1];
            const iid = date.split(' ')[0].replace(':', '').replace(':', '')
            const hashPath = product._id + '-' + iid + '.' + extention;
            const imgUploadPath = path.join(__dirname, '../uploads') + '/' + hashPath;
            const imgPath = files[Object.keys(files)[i]].path;

            const rawData = await fs.readFileSync(imgPath);

            try {
                const image = await uploadImage(imgUploadPath, rawData, iid, extention, product);
                product.images.push(image);
            } catch(err) {
                console.log(err);
            }
            await sleep(1000);
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


const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id });
        if (!product)
            return res.status(400).json({
                msg: 'Product Not Found'
            });
        await Product.deleteOne({ _id: id });

        return res.status(200).json({
            msg: 'Product deleted'
        });
    } catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
};

const updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json(errors);
    try {

        const id = req.params.id;
        const { title, price, description, quantity } = req.body;

        let product = await Product.findOne({ _id: id });

        if (!product)
            return res.status(400).json({
                msg: 'Product not found'
            });
        await Product.updateOne({ _id: id }, { title: title, price: price, description: description, quantity: quantity });
        product = await Product.findOne({ _id: id });
        return res.status(200).json({
            product: product
        })

    } catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
};
const updateProductThumbnail = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id });
        if (!product)
            return res.status(404).json({
                msg: 'Product Not Found'
            });

            const form = new formidable.IncomingForm();
            
            form.parse(req, (err, fields, files) => {
                const filename = files.thumbnail.name;
                const extention = filename.split('.')[1];
                const imgUploadPath = path.join(__dirname, '../uploads') + '/' + product._id + '.' + extention;
                const imgPath = files.thumbnail.path;
                const rawData = fs.readFileSync(imgPath);
                
            fs.unlink(imgUploadPath, (err) => {
                if (err) throw err;
                console.log('File deleted');
            })
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

    } catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
};
const updateProductImages = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id });
        if (!product || !product.images)
            return res.status(404).json({
                msg: 'Product not found'
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
                    await deleteFile(imgUploadPath);
                }catch(err) {
                    console.log(err.message);
                }
    
                try {
                    const image = await uploadImage(imgUploadPath, rawData, i, extention, product);
                    product.images.push(image);
                    console.log(product.images);
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
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
};


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
