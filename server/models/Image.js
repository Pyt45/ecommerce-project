const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ImageSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, "")
        },
        path: String,
        alt: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Image', ImageSchema);