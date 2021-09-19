const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Image = require('./Image');

const ProductSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, "")
        },
        title: String,
        price: Number,
        description: String,
        quantity: Number,
        thumbnail: String,
        images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
    },
    {
        timestamps: true
    }
);

ProductSchema.statics.createProduct = async function(title, price, description, quantity) {
    try {
        const product = await this.create({title, price, description, quantity});
        return product;
    } catch(err) {
        throw err;
    }
}

ProductSchema.statics.getAllProducts = async function(skip, limit) {
    try {
        const products = await this.find().skip(skip).limit(limit);
        return products;
    }catch(err) {
        throw err;
    }
}

ProductSchema.statics.fetchByTitle = async function(title, skip, limit) {
    try {
        const products = await this.find({title: `/${title}/`}).skip(skip).limit(limit);

        return products;
    }catch(err) {
        throw err;
    }
}

module.exports = mongoose.model('Product', ProductSchema);