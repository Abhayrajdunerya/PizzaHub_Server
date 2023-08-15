const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const subIngredientSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxLength: 100,
        text: true,
    },
    parent: {
        type: ObjectId, 
        ref: 'Ingredient',
        required: true,
    },
    slug: {
        type: String,
        unique: true,   
        lowercase: true,
        index: true,
    },
    images: {
        type: Array
    },
    qty: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    
}, {timestamps: true});

module.exports = mongoose.model('SubIngredient', subIngredientSchema);