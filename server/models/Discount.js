const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const DiscountSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-g/, '')
        },
        code: {
            type: String,
            required: true,
            unique: true
        },
        isPercent: {
            type: Boolean,
            required: true,
            default: true
        },
        amount: {
            type: Number,
            required: true
        },
        expiredDate: {
            type: String,
            required: true,
            default: ''
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Discount', DiscountSchema);