const express = require('express')

const router = express.Router()

const { getAllUsers, getUsersByRole, getASpecificUser, deleteUser } = require('../controllers/user-controller')

const {protect, restrictTo} = require('../middleware/authorization-middleware')



// getAllUsers route
router.route('/').get(protect, restrictTo('admin'), getAllUsers)

// getUsersByRole route
router.route('/role/:id').get(protect, restrictTo('admin'), getUsersByRole)


// getASpecificUser route
router.route('/:id').get(protect, getASpecificUser)


// deleteUser route
router.route('/:id').delete(protect, restrictTo('admin'), deleteUser)


module.exports = router 