const mongoose = require('mongoose');
const Category = require('../models/Category');

const connectDb = async (url) => {
    try {
        await mongoose.connect(url);
        /*const cat1 = new Category({
            title: "cat1",
        });
        const cat2 = new Category({
            title: "subCat1"
        });
        await cat2.save();
    cat1.categories.push(cat2);
    await cat1.save()*/
    } catch(err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDb;