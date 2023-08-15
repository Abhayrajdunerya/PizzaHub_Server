const SubIngredient = require('../models/subIngredient');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        const {title, parent, qty} = req.body;
        const result = await new SubIngredient({title, parent, qty, slug: slugify(title).toLowerCase()}).save();
        res.json(result);
    } catch (err) {
        console.log("SubIngredient CREATE ERR ----> ", err);
        res.status(400).send('Create SubIngredient failed');
    }
};

exports.list = async (req, res) => {
    res.json(await SubIngredient.find({}).sort({createdAt: -1}).exec());
};

exports.read = async (req, res) => {
    let result = await SubIngredient.findOne({slug: req.params.slug}).exec();
    res.json(result);
};

exports.readSubIngredientByIngredient = async (req, res) => {
    // console.log(req.params._id);
    let result = await SubIngredient.find({parent: req.params._id}).exec();
    res.json(result);
};

exports.update = async (req, res) => {
    const {title, parent, qty} = req.body;
    console.log(req.body);
    try {
        const updated = await SubIngredient.findOneAndUpdate({slug: req.params.slug}, {title, parent, qty, slug: slugify(title)}, {new: true}).exec();
        res.json(updated);
    } catch (err) {
        res.status(400).send('Update SubIngredient failed');
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await SubIngredient.findOneAndDelete({slug: req.params.slug}).exec();
        res.json(deleted);
    } catch (err) {
        res.status(400).send('Delete SubIngredient failed');
    }
};

exports.addQty = async (req, res) => {
    try {
        const {_id, qty} = req.body;
        const result = await SubIngredient.findByIdAndUpdate({_id: _id}, {qty: qty}, {new: true}).exec();
        res.json(result);
    } catch (err) {
        res.status(400).send('Add qty. failed');
    }
};
