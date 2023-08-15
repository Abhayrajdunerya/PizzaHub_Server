const mongoose =  require('mongoose');
const {ObjectId} = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    pizzas: [
        {
            pizza: {
                type: ObjectId,
                ref: 'Pizza',
            },
            count: Number,
            size: String,
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: 'Order received',
        enum: [
            'Order received',
            'In the kitchen',
            'Sent to delivery',
        ]
    },
    orderTotal: Number,
    orderedBy: { type: ObjectId, ref: 'User' }

}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);