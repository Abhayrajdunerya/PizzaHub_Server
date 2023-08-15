const express = require('express')
const router = express.Router()

// middlewares
const {authCheck, adminCheck} = require('../middlewares/auth')

// controllers
const {create, read, update, remove, list, readById, getSubs} = require('../controllers/ingredient')

// routes
router.post('/ingredient', authCheck, adminCheck, create)
router.get('/ingredient/:slug', read)
router.get('/ingredientById/:_id', readById)
router.put('/ingredient/:slug', authCheck, adminCheck, update)
router.delete('/ingredient/:slug', authCheck, adminCheck, remove)

router.get('/ingredients', list)
router.get('/ingredient/subs/:_id', getSubs)

module.exports = router;