const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const AddressSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, '')
        },
        country: String,
        city: String,
        zipCode: String,
        address: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Address', AddressSchema);