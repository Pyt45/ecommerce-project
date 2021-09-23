const mongoose = require('mongoose');
const { v4: uuid4v } = require('uuid');
// const Product = require('./Product');

const SubCategorySchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuid4v().replace(/\-/g, "")
        },
        name: {
            type: String,
            trim: true
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true
        },
        parent: { type: mongoose.Schema.Types.String, ref: 'Category', required: true }
        // products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('SubCategory', SubCategorySchema);
