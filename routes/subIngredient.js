const express = require("express");
const router = express.Router();

// middlewares
const {authCheck, adminCheck} = require('../middlewares/auth');

// controllers
const {create, read, update, remove, list, readSubIngredientByIngredient, addQty} = require('../controllers/subIngredient');

// routes
router.post('/subIngredient', authCheck, adminCheck, create);
router.get('/subIngredients', list);
router.get('/subIngredient/:slug', read);
router.get('/subIngredientsByIngredient/:_id', readSubIngredientByIngredient);
router.put('/subIngredient/:slug', authCheck, adminCheck, update);
router.delete('/subIngredient/:slug', authCheck, adminCheck, remove);
router.put('/addQty', authCheck, adminCheck, addQty);

module.exports = router;