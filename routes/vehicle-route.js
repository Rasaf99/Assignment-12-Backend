const express = require('express')

const { fetchVehicles, searchVehiclesByCategory, searchVehiclesBySeller, createVehicle, deleteVehicle, updateVehicle, uploadVehicleImage } = require('../controllers/vehicle-controller')


const { protect, restrictTo } = require('../middleware/authorization-middleware')



const router = express.Router()


// Get all vehicles
router.route('/').get(protect, fetchVehicles)


// Get a specific categories's vehicles
router.route('/category/:id').get(protect, searchVehiclesByCategory)

// Get a specific seller's vehicles
router.route('/seller/:id').get(protect, searchVehiclesBySeller)

// Post a new vehicle
router.route('/').post(protect, restrictTo('seller'), createVehicle)

// Delete a specific vehicle
router.route('/:id').delete(protect, restrictTo('seller'), deleteVehicle)


// Update a specific vehicle
router.route('/:id').patch(protect, restrictTo('seller'), updateVehicle)


// Upload image of a vehicle
router.route('/:id/image').post(uploadVehicleImage)



module.exports = router