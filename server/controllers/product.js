const { validationResult } = require('express-validator');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

const fetchProduct = async (req, res) => {};
const fetchProductById = async (req, res) => {};

const createProduct = async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty())
    //     return res.status(400).json(errors);
    const { title, price, description, quantity, thumbnail } = req.body;

    try {
        // const product = await Product.createProduct(title, price, description, quantity, thumbnail);
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            console.log(files);
            // const imgUrl = files.thumbnail.path;
            // const imgUpload = path.join(__dirname, '../uploads') + '/' + files.thumbnail.name;
            const rawData = fs.readFileSync(path.join(__dirname, '../usb-cable.jpeg'));

            fs.writeFile(imgUpload, rawData, (err) => {
                if (err) throw err;
                return res.status(200).json({
                    success: true,
                    // productPath: imgUrl,
                    // uploadTo: imgUpload
                })
            })
        })
        // console.log(imgUrl);
        return res.status(200).json({
            success: true,
            // productInfo: imgUrl,
            // uploadTo: imgUpload
        })
    }catch(err) {
        console.log(err.message);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};

const updateProduct = async (req, res) => {};
const deleteProduct = async (req, res) => {};


module.exports = {
    fetchProduct,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
}