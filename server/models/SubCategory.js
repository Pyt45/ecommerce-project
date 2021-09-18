const mongoose = require('mongoose');
const { v4: uuid4v } = require('uuid');
const Product = require('./Product');

const SubCategorySchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuid4v().replace(/\-/g, "")
        },
        title: String,
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('SubCategory', SubCategorySchema);