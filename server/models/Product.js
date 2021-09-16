const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ProductSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, "")
        },
        title: String,
        price: String,
        description: String,
        productPhotoPath: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', ProductSchema);