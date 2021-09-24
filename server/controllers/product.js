const { validationResult } = require('express-validator');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { uploadImage, deleteFile, addVariants } = require('../utils/ProductUtils');
const Product = require('../models/Product');
const Image = require('../models/Image');
const Category = require('../models/Category');
const { Variant, Option } = require('../models/Variant');


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
            // await changePermission(imgUploadPath);
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

const addVariantsToProduct  = async (req, res) => {
    try {
        const { id } = req.params;
        const { variants } = req.body;
        // let newVart;
        let product = await Product.findOne({ _id: id });
        if (!product)
            return res.status(404).json({
                msg: 'Product not found'
            })

        let i = 0;
        await variants.forEach(async (variant) => {
            // newVart = await new Variant({
            //     name: variant.name
            // }).save();
            // const options = variant.options;
            // options.forEach(async (e) => {
            //     let option = await new Option({
            //         value: e.value
            //     }).save()
            //     newVart.options.push(option);
            // })
            // await newVart.save();
            // product.variants.push(newVart);
            // await product.save();
            const newVart = await addVariants(variant);
            await newVart.save();
            product.variants.push(newVart);
            i++;
            if (i == variants.length)
                await product.save();
        });

        product = await Product.findOne({ _id: id }).populate('variants'); 
        return res.status(200).json(product);

        // for (let i = 0; i < variants.length; i++) {    
        //     const names = Object.keys(variants[i]);
        //     console.log(names)
        //     for (let j = 0; j < names.length; j++) {
        //         let newVariant = new Variant({
        //             name: names[j]
        //         });
        //         await newVariant.save();
        //         // console.log(variants[names[j]])
        //         const options = variants[i][names[j]]
        //         // console.log(options)
        //         for (let k = 0; k < options.length; k++) {
        //             const newOption = new Option({
        //                 value: options[k]
        //             });
        //             await newOption.save();
        //             newVariant.options.push(newOption);
        //         }
        //         await newVariant.save();
        //     }
        // }
        // const vars = new Variant({
        //     variant: [
        //         new Option({
        //             option: 
        //         });
        //     ]
        // })
    } catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
}

const createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
    return res.status(400).json(errors);
    let { title, price, description, quantity, category, subCategories} = req.body;
    
    try {
        const cat = await Category.findOne({ _id: category });
        if (!cat)
            return res.status(400).json({
                msg: 'Category not found'
            })
        const product = await Product.createProduct(title, price, description, quantity, category, subCategories);

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

const fetchProductBySlug = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const slug = req.params.slug || "";

        const products = await Product.fetchBySlug(slug, skip, limit);
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
        const thumbnailPath = path.join(__dirname, '..', `${product.thumbnail}`);
        await deleteFile(thumbnailPath);
        for (let i = 0; i < product.images.length; i++) {
            const img = await Image.findOne({ _id: product.images[i] });
            const filepath = path.join(__dirname, '..', `/${img.path}`);
            console.log(`path of img = ${filepath}`);
            await deleteFile(filepath);
            await Image.deleteOne({ _id: product.images[i] });
        }

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
        const { title, price, description, quantity, category, subCategories } = req.body;

        let product = await Product.findOne({ _id: id });

        if (!product)
            return res.status(400).json({
                msg: 'Product not found'
            });
        await Product.updateOne({ _id: id }, { title: title, price: price, description: description, quantity: quantity, category: category, subCategories: subCategories });
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
                
                const filepath = path.join(__dirname, '..', `${product.thumbnail}`);
                fs.unlink(filepath, (err) => {
                    if (err) throw err;
                    console.log('File deleted');
                })
                fs.writeFile(imgUploadPath, rawData, async (err) => {
                    if (err) {
                        return res.status(500).send('Internal server error');
                    }
                    // await changePermission(imgUploadPath);
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
            // const date = new Date().toLocaleString().split(', ')[1];
            const iid = uuidv4().replace(/\-/g, '');
            const hashPath = product._id + '-' + iid + '.' + extention;
            const imgUploadPath = path.join(__dirname, '../uploads') + '/' + hashPath;
            const imgPath = files[Object.keys(files)[i]].path;

            const rawData = await fs.readFileSync(imgPath);

            try {
                const image = await uploadImage(imgUploadPath, rawData, iid, extention, product._id);
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

const updateProductImage = async (req, res) => {
    try {
        const { id, idimg } = req.params;

        const product = await Product.findOne({ _id: id }).populate('images');
        if (!product)
            return res.status(404).json({
                msg: 'Product not found'
            });
        let image = product.images.find((e) => e._id == idimg)
        if (!image)
            return res.status(400).json({
                msg: 'Image not found'
            });

        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            const filename = files.image.name;
            const extention = filename.split('.')[1];
            const iid = uuidv4().replace(/\-/g, '');
            const hashPath = '/uploads/' + product._id + '-' + iid + '.' + extention;
            const imgUploadPath = path.join(__dirname, '..', `${hashPath}`)
            const imgPath = files.image.path;
            const newImgPath = '/uploads/' + product._id + '-' + iid + '.' + extention;
            const oldImgPath = path.join(__dirname, '..', `${image.path}`);
            console.log(oldImgPath);
            fs.unlink(oldImgPath, (err) => {
                if (err) throw err;
                console.log('File deleted');
            })
            const rawData = fs.readFileSync(imgPath);

            fs.writeFile(imgUploadPath, rawData, async (err) => {
                if (err) return res.status(500).send('Internal server error');
                await Image.updateOne({ _id: idimg }, { path: newImgPath });
                image = await Image.findOne({ _id: idimg });
                image.path = newImgPath;
                await image.save();
                product.images.find((e) => e._id == idimg).path = newImgPath;
                await product.save();
            })
            const newImg = await Image.findOne({ _id: idimg });
            return res.status(200).json({
                success: true,
                productInfo: product,
                image: newImg
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
    fetchProductBySlug,
    createProduct,
    updateProduct,
    updateProductThumbnail,
    updateProductImage,
    deleteProduct,
    addThumbnailToProduct,
    addImagesToProduct,
    addVariantsToProduct
}
