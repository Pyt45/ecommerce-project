const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const OptionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, '')
        },
        value: String
    },
    {
        timestamps: true
    }
)

const VariantSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, '')
        },
        name: String,
        options: [{ type: mongoose.Schema.Types.String, ref: 'Option' }]
    },
    {
        timestamps: true
    }
);

module.exports = {
    Option: mongoose.model('Option', OptionSchema),
    Variant: mongoose.model('Variant', VariantSchema)
};