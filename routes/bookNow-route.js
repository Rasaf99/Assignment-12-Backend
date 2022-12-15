const express = require('express')

const router = express.Router()

const { FetchBookNowByBuyer, createBookNow, deleteBookNow } = require('../controllers/bookNow-controller')

const { protect, restrictTo } = require('../middleware/authorization-middleware')


// FetchBookNowByBuyer route
router.route('/buyer/:id').get(protect, restrictTo('buyer'), FetchBookNowByBuyer)

// Post a new bookNow
router.route('/').post(protect, restrictTo('buyer'), createBookNow)

// Delete a specific bookNow
router.route('/:id').delete(protect, restrictTo('buyer'), deleteBookNow)



module.exports = router 