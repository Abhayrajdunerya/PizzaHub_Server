const express = require("express");
const router = express.Router();

// middlewares
const {authCheck, adminCheck} = require('../middlewares/auth');

// controllers
const {orders, orderStatus, ingredientStatus, addItems, reduceSubCount, getQtyAlert} = require('../controllers/admin');

router.get('/admin/orders', authCheck, adminCheck, orders);
router.put('/admin/order-status', authCheck, adminCheck, orderStatus);

router.get('/admin/ingredient-status', authCheck, adminCheck, ingredientStatus);
router.put('/admin/add-items', authCheck, adminCheck, addItems);

router.put('/admin/reduce-sub-count', authCheck, adminCheck, reduceSubCount);

router.get('/admin/alert', authCheck, adminCheck, getQtyAlert);

module.exports = router;