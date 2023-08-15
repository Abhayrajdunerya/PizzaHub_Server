const Pizza = require('../models/pizza');
const User = require('../models/user');
const slugify = require('slugify');
const { query } = require('express');

exports.create =  async (req, res) => {
    try {
        let {title, size} = req.body;
        req.body.slug = slugify(title+'-'+size);
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

exports.read =  async (req, res) => {
    const product = await Pizza.findOne({slug: req.params.slug})
    .populate('ingredient')
    .populate('subIngredient')
    .exec();
    res.json(product);
}

exports.listAll =  async (req, res) => {
    try {
        let products = await Pizza.find({pizzaType: 'premade'})
        .limit(parseInt(req.params.count))
        // .populate('SubIngredient')
        .sort([['createdAt', 'desc']])
        .exec()
        res.json(products);
    } catch (err) {
        console.log(err);
        // res.status(400).send('Create Pizza Failed');
        res.status(400).json({
            err: err.message,
        })
    }
}

exports.remove =  async (req, res) => {
    try {
        let deletedPizza = await Pizza.findOneAndRemove({slug: req.params.slug}).exec();
        res.json(deletedPizza);
    } catch (err) {
        console.log(err);
        return res.status(400).send('Delete Pizza Failed');
    }
}

exports.update =  async (req, res) => {
    try {
        if (req.body.title) {
            let {title, size} = req.body;
            req.body.slug = slugify(title+'-'+size);
            // req.body.slug = slugify(req.body.title);
        }
        const updatedPizza = await Pizza.findOneAndUpdate({slug: req.params.slug}, req.body, {new: true}).exec();
        res.json(updatedPizza);
    } catch (err) {
        console.log(err);
        // return res.status(400).send('Update Pizza Failed');
        res.status(400).json({
            err: err.message,
        })
    }
}