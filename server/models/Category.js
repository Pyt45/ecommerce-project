const mongoose = require('mongoose');
const { v4: uuid4v } = require('uuid');
const SubCategory = require('./SubCategory');

const CategorySchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuid4v().replace(/\-/g, "")
        },
        title: String,
        subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Category', CategorySchema);