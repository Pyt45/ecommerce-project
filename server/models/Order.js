const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Address = require('./Address');
const Product = require('./Product');

const ORDER_STATUS = {
    PROCESSED: [0, 'PROCESSED'],
    DELIVERED: [1, 'DELIVERED'],
    SHIPPED: [2, 'SHIPPED'],
}

const OrderSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, "")
        },
        trackingNumber: String,
        orderStatus: {
            type: Number,
            default: ORDER_STATUS.PROCESSED[0]
        },
        orderItems: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' },
        address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', OrderSchema);
