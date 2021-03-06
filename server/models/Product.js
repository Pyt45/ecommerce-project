const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

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
        images: [{ type: mongoose.Schema.Types.String, ref: 'Image' }],
        variants: [{ type: mongoose.Schema.Types.String, ref: 'Variant' }],
        // comments: [{ type: mongoose.Schema.Types.String, ref: 'Comment' }],
        category: { type: mongoose.Schema.Types.String, ref: 'Category' },
        subCategories: [{ type: mongoose.Schema.Types.String, ref: 'SubCategory' }]
    },
    {
        timestamps: true
    }
);

ProductSchema.statics.createProduct = async function(title, price, description, quantity, category, subCategories) {
    try {
        const product = await this.create({title, price, description, quantity, category, subCategories});
        return product;
    } catch(err) {
        throw err;
    }
}

ProductSchema.statics.getAllProducts = async function(skip, limit) {
    try {
        const products = await this.find({})
                .skip(skip)
                .limit(limit)
                .populate('category')
                .populate('subCategories')
                .sort([['createAt', 'desc']])
                .exec();
        return products;
    }catch(err) {
        throw err;
    }
}

ProductSchema.statics.fetchByTitle = async function(title, skip, limit) {
    try {
        // const products = await this.find({title: `/${title}/`}).skip(skip).limit(limit);
        const products = await this.find({ title: { $regex: '.*' + title + '.*'}}).skip(skip).limit(limit);
        return products;
    }catch(err) {
        throw err;
    }
}

ProductSchema.statics.fetchBySlug = async function(slug, skip, limit) {
    try {
        const products = await this.find({ slug: slug })
            .skip(skip)
            .limit(limit)
            .populate('category')
            .populate('subCategories')
            .exec()
    }catch(err) {
        throw err;
    }
}

module.exports = mongoose.model('Product', ProductSchema);