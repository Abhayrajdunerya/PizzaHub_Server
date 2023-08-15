const express = require("express");
const router = express.Router();

// middlewares
const {authCheck, adminCheck} = require('../middlewares/auth');

// controllers
const {create, listAll, remove, read, update } = require('../controllers/pizza');

// routes
router.post('/pizza', authCheck, adminCheck, create);
router.get('/pizzas/:count', listAll);
router.delete('/pizza/:slug', authCheck, adminCheck, remove);
router.get('/pizza/:slug', read);
router.put('/pizza/:slug', authCheck, adminCheck, update);

module.exports = router;