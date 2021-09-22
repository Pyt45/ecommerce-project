const slugify = require('slugify');
const { validationResult } = require('express-validator');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');
// const Category = require('../models/Category');

const onGetAllSubCategory = async (req, res) => { 
    try {
        const subCategories = await SubCategory.find({}).sort({ createAt: -1 }).exec();
        return res.status(200).json(subCategories);
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
};
const onGetSubCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const subCategory = await SubCategory.findOne({ slug: slug });
        if (!subCategory)
            return res.status(400).json({
                msg: 'subCategory not found'
            });
        return res.status(200).json(subCategory);
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
};
const onCreateSubCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json(errors);
    try {
        const { name, parent } = req.body;
        const subCateg = await SubCategory.findOne({ name: name });
        const category = await Category.findOne({ _id: parent });
        if (subCateg)
            return res.status(400).json({
                msg: 'subCategory alredy exist'
            });
        const subCategory = await new SubCategory({ name: name, slug: slugify(name), parent: category }).save();
        return res.status(200).json(subCategory);
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
};
const onUpdateSubCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json(errors);
    try {
        const { slug } = req.params;
        const { name, parent } = req.body;
        const category = await Category.findOne({ _id: parent });
        let subCategory = await SubCategory.findOne({ slug: slug });
        if (!subCategory)
            return res.status(400).json({
                msg: 'subCategory not found'
            });
        // subCategory.name = name;
        // subCategory.slug = slugify(name);
        // subCategory.parent = cat;
        await SubCategory.updateOne({ slug: slug }, { name: name, slug: slugify(name), parent: category });
        // await subCategory.save();
        return res.status(200).json({
            msg: 'subCategory updated'
        });
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
};
const onDeleteSubCategory = async (req, res) => { 
    try {
        const { slug } = req.params;
        const subCategory = await SubCategory.findOne({ slug: slug });
        if (!subCategory)
            return res.status(400).json({
                msg: 'subCategory not found'
            });
        await SubCategory.deleteOne({ slug: slug });
        return res.status(200).json({
            msg: 'subCategory deleted'
        })
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
};

module.exports = {
    onGetAllSubCategory,
    onGetSubCategoryBySlug,
    onCreateSubCategory,
    onUpdateSubCategory,
    onDeleteSubCategory
}