const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
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
}, {timestamps: true});

module.exports = mongoose.model('Ingredient', ingredientSchema);