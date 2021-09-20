const Image = require('../models/Image');
const fs = require('fs');
const fsPromise = require('fs').promises;

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

const uploadImage = (uploadDir, rawData, i, extention, product) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(uploadDir, rawData, async (err) => {
            if (err) reject(err);

            // await changePermission(uploadDir);            
            const pathToImg = '/uploads/' + product._id + '-' + i + '.' + extention;

            const image = new Image();
            image.path = pathToImg;
            await image.save();
            resolve(image);
        })
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
    deleteFile
}