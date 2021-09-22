const mongoose = require('mongoose');
const { v4: uuid4v } = require('uuid');
// const SubCategory = require('./SubCategory');

const CategorySchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuid4v().replace(/\-/g, "")
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true
        },
        // subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Category', CategorySchema);