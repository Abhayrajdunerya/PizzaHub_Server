const User = require('../models/user');
const Pizza = require('../models/pizza');
const Cart = require('../models/cart');
const Order = require('../models/order');
const uniqueid = require('uniqid')

// Cart
exports.userCart = async (req, res) => {
    // console.log(req.body);
    const { cart } = req.body;

    let pizzas = [];

    const user = await User.findOne({ email: req.user.email }).exec();

    // check if cart with logged in user id already exist
    let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec();

    console.log("-------------", cartExistByThisUser);

    if (cartExistByThisUser) {
        // cartExistByThisUser.remove();
        console.log('id -> ', cartExistByThisUser._id);
        await Cart.findByIdAndDelete(cartExistByThisUser._id);
        // console.log('removed old cart');
    }

    for (let i = 0; i < cart.length; i++) {
        let object = {};

        object.pizza = cart[i]._id;
        object.count = cart[i].count;
        // object.color = cart[i].color;
        // object.size = cart[i].size;

        // get price for creating total
        let pizzaFromBD = await Pizza.findById(cart[i]._id).select('price').exec();
        object.price = pizzaFromBD.price;

        pizzas.push(object);
    }

    // console.log('pizzas', pizzas);

    let cartTotal = 0;
    for (let i = 0; i < pizzas.length; i++) {
        cartTotal += pizzas[i].price * pizzas[i].count;
    }

    // console.log('cartTotal', cartTotal);

    let newCart = await new Cart({
        pizzas,
        cartTotal,
        orderedBy: user._id,
    }).save();

    // console.log('NEW CART', newCart);
    res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    let cart = await Cart.findOne({ orderedBy: user._id })
        .populate('pizzas.pizza', '_id title price totalAfterDiscount')
        .exec();

    console.log(cart);

    if (cart) {
        const { pizzas, cartTotal, totalAfterDiscount } = cart;
        res.json({ pizzas, cartTotal, totalAfterDiscount });
    } else {
        res.json({ isEmpty: true });
    }


};

exports.emptyCart = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();
    const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
    res.json(cart);
}

// Orders
exports.createOrder = async (req, res) => {
    const { razorpayResponse } = req.body;
    const user = await User.findOne({ email: req.user.email }).exec();
    // console.log('user', user);
    let { pizzas } = await Cart.findOne({ orderedBy: user._id }).exec();

    let newOrder = await new Order({
        pizzas,
        paymentIntent: razorpayResponse,
        orderedBy: user._id,
    }).save();

    // decrement quantiti, increment sold
    let bulkOption = pizzas.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.pizza._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });

    let updated = await Pizza.bulkWrite(bulkOption, { new: true });
    // console.log('PRODUCT QUANTITY-- AND SOLD++', updated);

    // console.log('NEW ORDER SAVED', newOrder);
    res.json({ ok: true });
}

exports.orders = async (req, res) => {
    let user = await User.findOne({ email: req.user.email });

    let userOrders = await Order.find({ orderedBy: user._id })
        .populate('pizzas.pizza')
        .populate('pizzas.pizza.brand')
        .exec();
    res.json(userOrders);
}

exports.createCashOrder = async (req, res) => {

    const { COD, couponApplied } = req.body;

    if (!COD) return res.status(400).send('Create cash order failed');

    // const { razorpayResponse } = req.body;
    const user = await User.findOne({ email: req.user.email }).exec();
    let userCart = await Cart.findOne({ orderedBy: user._id }).exec();

    let finalAmount = 0;

    if (couponApplied && userCart.totalAfterDiscount) {
        finalAmount = (userCart.totalAfterDiscount * 100)
    } else {
        finalAmount = (userCart.cartTotal * 100)
    }

    let newOrder = await new Order({
        pizzas: userCart.pizzas,
        paymentIntent: {
            id: uniqueid(),
            amount: finalAmount,
            currency: 'INR',
            status: 'Cash On Delivery',
            created_at: Date.now(),
            receipt: uniqueid()
        },
        orderedBy: user._id,
        orderStatus: 'Cash On Delivery'
    }).save();

    // decrement quantiti, increment sold
    let bulkOption = userCart.pizzas.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.pizza._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });

    let updated = await Pizza.bulkWrite(bulkOption, { new: true });
    // console.log('PRODUCT QUANTITY-- AND SOLD++', updated);

    // console.log('NEW ORDER SAVED', newOrder);
    res.json({ ok: true });
}

// Wishlist
exports.addToWishlist = async (req, res) => {
    const { pizzaId } = req.body;

    const user = await User.findOneAndUpdate(
        { email: req.user.email },
        { $addToSet: { wishlist: pizzaId } },
        { new: true }
    ).exec();

    res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
    const list = await User.findOne({ email: req.user.email })
        .select('wishlist')
        .populate('wishlist')
        .exec();

    res.json(list);
}

exports.removeFromWishlist = async (req, res) => {
    const { pizzaId } = req.params;
    const user = await User.findOneAndUpdate(
        { email: req.user.email },
        { $pull: { wishlist: pizzaId } }
    ).exec();

    res.json({ ok: true });
}


// Account

exports.saveAddress = async (req, res) => {
    // console.log(req.user);
    const userAddress = await User.findOneAndUpdate(
        { email: req.user.email },
        { address: req.body.address }
    ).exec();

    res.json({ ok: true });
}

exports.getAddress = async (req, res) => {
    // console.log(req.user);
    const user = await User.findOne({ email: req.user.email }).select('address').exec();
    res.json(user.address);
}

exports.updateUserDetails = async (req, res) => {
    const { name } = req.body;
    const user = await User.findOneAndUpdate({ email: req.user.email }, { name }, { new: true });
    res.json(user);
}

exports.createPizza = async (req, res) => {
    try {
        const { subIngredients } = req.body;
        console.log(req.body);
        req.body.title = 'User Defined Pizza';
        req.body.slug = uniqueid();
        req.body.description = "custom pizza description";
        req.body.price = 499;
        req.body.pizzaType = "custom";

        const newPizza = await new Pizza(req.body).save();
        res.json(newPizza);
    } catch (err) {
        console.log(err);
        // res.status(400).send('Create Pizza Failed');
        res.status(400).json({
            err: err.message,
        })
    }


}

