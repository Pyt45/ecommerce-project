const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('OrderItem', OrderItemSchema);