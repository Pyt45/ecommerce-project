const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const OrderSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, "")
        },
        productId: String,
        quantity: Number,
        addressShipping: String,
    },
    {
        timestamps: true
    }
);

module.exports = OrderSchema.model('Order', OrderSchema);