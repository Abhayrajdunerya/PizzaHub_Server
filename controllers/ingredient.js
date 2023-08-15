const Ingredient = require('../models/ingredient')
const SubIngredient = require('../models/subIngredient')
const slugify = require('slugify')

exports.list = async (req, res) => {
    res.json(await Ingredient.find({}).sort({createdAt: -1}).exec());
};

exports.create = async (req, res) => {
    try {
        // console.log(req.body);
        const {title} = req.body;
        const result = await new Ingredient({title, slug: slugify(title).toLowerCase()}).save();
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(400).send('Create Ingredient failed');
    }
}

exports.read = async (req, res) => {
    const result = await Ingredient.findOne({slug: req.params.slug}).exec()
    res.json(result);
}

exports.readById = async (req, res) => {
    // console.log('_id ===> ', req.params._id);
    const result = await Ingredient.findById(req.params._id).exec()
    res.json(result);
}

exports.update = async (req, res) => {
    const {title} = req.body;
    try {
        const updated = await Ingredient.findOneAndUpdate({slug: req.params.slug}, {title, slug: slugify(title)}, {new: true}).exec();
        res.json(updated);
    } catch (err) {
        res.status(400).send('Update Ingredient failed');
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Ingredient.findOneAndDelete({slug: req.params.slug}).exec();
        res.json(deleted);
    } catch (err) {
        res.status(400).send('Delete Ingredient failed');
    }
};

exports.getSubs = async (req, res) => {
    try {
        const result = await SubIngredient.find({parent: req.params._id}).exec();
        res.json(result);
    } catch (err) {
        console.log(err);
    }

};


