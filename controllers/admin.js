const Order = require('../models/order');
const subIngredient = require('../models/subIngredient');
const SubIngredient = require('../models/subIngredient');
const firebase = require('firebase-admin')

exports.orders = async (req, res) => {
    let allOrders = await Order.find({})
    .sort('-createdAt')
    .populate('pizzas.pizza')
    .populate('pizzas.pizza.subIngredients')
    .exec()

    res.json(allOrders);
}

exports.orderStatus = async (req, res) => {
    // console.log("------------> ", req.body);
    const { orderId, orderStatus } = req.body;

    let updated = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true })
    .populate('pizzas.pizza')
    .populate('pizzas.pizza.subIngredients')
    .exec();

    res.json(updated);
}

exports.ingredientStatus = async (req, res) => {
      
    const result = await SubIngredient.find({}).exec();

    res.json(result);
}

exports.addItems = async (req, res) => {
    const { id, qty } = req.body;
    const result = await subIngredient.findById(id).exec();
    const newQty = qty+result.qty;
    const updated = await subIngredient.findByIdAndUpdate(id, { qty: newQty }).exec();

    res.json(updated);
}

exports.reduceSubCount = async (req, res) => {
    try {
        // console.log(req.body);
        // const {_id, n} = req.body;
        // const subIng = await SubIngredient.findById(_id);
        // const result = await SubIngredient.findByIdAndUpdate(_id, {qty: subIng.qty-n}).exec();
        const {subIngredient, n, count} = req.body;
        // console.log(req.body);
        await subIngredient.map(async (_id, i) => {
            const subIng = await SubIngredient.findById(_id);
            const result = await SubIngredient.findByIdAndUpdate(_id, {qty: subIng.qty-(count*n)}).exec();
        })

    } catch (err) {
        console.log(err);
    }
    
}

exports.getQtyAlert = async (req, res) => {
    try {
        const lowQuantityIngredients = await SubIngredient.find({ qty: { $lt: process.env.THRESHOLD } });
        // console.log(lowQuantityIngredients);

        res.json(lowQuantityIngredients.length > 0);
    } catch (err) {
        console.log(err);
    }
}

