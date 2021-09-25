const fs = require('fs');
const fsPromise = require('fs').promises;
const Image = require('../models/Image');
const { Variant, Option } = require('../models/Variant');

const changePermission = async (filepath) => {
    try {
        const { fd } = await fsPromise.open(filepath, 'r');
        fs.fchmod(fd, 0o664, (err) => {
            if (err) throw err;
            fs.close(fd, (err) => {
                 if (err) throw err;
             })
        });

    } catch(err) {
        console.log(err.message);
    }
};

const addOptions = (option) => {
    return new Promise( async (resolve, reject) => {
        const opt = new Option({
            value: option.value
        });
        await opt.save();
        resolve(opt);
    });
}

const addVariants =  (variant) => {
    return new Promise(async (resolve, reject) => {
        const vart = new Variant({
            name: variant.name
        })
        const options = variant.options;
        // let i = 0;
        await options.forEach(async (option) => {
            let opt = await addOptions(option);
            vart.options.push(opt);
            // i++;
            // if (i == options.length)
        })
        await vart.save();
        resolve(vart);
    })
}

const uploadImage = (uploadDir, rawData, iid, extention, id) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(uploadDir, rawData, async (err) => {
            if (err) reject(err);

            // await changePermission(uploadDir);            
            const pathToImg = '/uploads/' + id + '-' + iid + '.' + extention;

            const image = await new Image({
                path: pathToImg
            }).save();

            resolve(image);
        })
    })
}

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

const updateImage = (uploadDir, rawData, iid, extention, id) => {
    return Promise((resolve, reject) => {
        // const img = await Image.findOne({ _id:  });
    })
}

const deleteFile = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, async (err) => {
            if (err) reject(err);
            resolve();
        })
    });
}

module.exports = {
    uploadImage,
    changePermission,
    deleteFile,
    addVariants
}