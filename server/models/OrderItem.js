const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const OrderItemSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, '')
        },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        discount: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('OrderItem', OrderItemSchema);