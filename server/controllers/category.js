const slugify = require('slugify');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const { validationResult } = require('express-validator');
const { findOne } = require('../models/Category');

const OnGetAllCategory = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
        return res.status(200).json(categories);
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
}
const OnGetCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug: slug });
        if (!category)
            return res.status(400).json({
                msg: 'Category not found'
            });
        return res.status(200).json(category);
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
}
const OnCreateCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json(errors);
    try {
        const { name } = req.body;
        const catg = await Category.findOne({ name: name });
        if (catg)
            return res.status(400).json({
                msg: 'Category alredy exist'
            });
        const category = await new Category({ name: name, slug: slugify(name) }).save();

        return res.status(200).json(category);
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
}
const OnUpdateCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json(errors);
    try {
        const { slug } = req.params;
        const { name } = req.body;
        let category = await Category.findOne({ slug: slug });
        if (!category)
            return res.status(400).json({
                msg: 'Category not found'
            })
        category.name = name;
        category.slug = slugify(name);
        await category.save();
        return res.status(200).json({
            msg: 'Category updated'
        })
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
}
const OnDeleteCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug: slug });
        if (!category)
            return res.status(400).json({
                msg: 'Category not found'
            });
        await Category.deleteOne({ slug: slug });
        return res.status(200).json({
            msg: 'Category deleted'
        })
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error');
    }
}

const onGetSubCategories = async (req, res) => {
    try {
        const { id } = req.params;
        const cat = await Category.findOne({ _id: id });
        console.log(cat);
        const subCaterogies = await SubCategory.find({ parent: cat });
        return res.status(200).json(subCaterogies);
    }catch(err) {
        console.log(err.message);
        return res.status(500).send('Internal server error')
    }
}

module.exports = {
    OnGetAllCategory,
    OnGetCategoryBySlug ,
    OnCreateCategory,
    OnUpdateCategory,
    OnDeleteCategory,
    onGetSubCategories
}