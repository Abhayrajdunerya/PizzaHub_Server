const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const pizzaSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxLength: 100,
        text: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000,
        text: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxLength: 32,
    },
    subIngredients: [
        {
            type: ObjectId,
            ref: 'SubIngredient',
        }
    ],
    images: {
        type: Array
    },
    quantity: Number,
    sold: {
        type: Number,
        default: 0,
    },
    pizzaType: {
        type: String,
        enum: ['custom', 'premade'],
        default: 'premade',
    }
}, {timestamps: true});

module.exports = mongoose.model('Pizza', pizzaSchema);