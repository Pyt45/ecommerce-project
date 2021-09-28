const User = require('../models/User');
const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');

const authOrder = (req, res, next) => {
    try {
        const payload = req.payload;
        const { id } = req.body;
        const orderItem = await OrderItem.findOne({ _id: id });
        const user = await User.findOne({ _id: payload.userID });

        if (!user || !orderItem)
            return res.status(404).json({
                msg: 'Not found'
            });
        
    }catch(err) {
        console.log(er.message);
        throw err;
    }
}
module.exports = authOrder;