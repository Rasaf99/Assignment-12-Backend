const mongoose = require('mongoose');


const vehicleSchema = mongoose.Schema({

    category: {
        type: String,
        enum: ['buses', 'trucks', 'cars'],
        required: true
    },

    vehicle_name: {
        type: String,
        required: true
    },

    resale_price: {
        type: Number,
        required: true
    },

    original_price: {
        type: Number,
        required: true
    },

    years_of_use: {
        type: Number,
        required: true
    },

    condition: {
        type: String,
        enum: ['excellent', 'good', 'fair'],
        required: true
    },

    vehicle_image: {
        type: String
    },

    seller_id: {
        type: String,
        required: true,
    },

    seller_username:{
        type: String,
        required: true
    },

    seller_location: {
        type: String,
        required: true
    },


}, { timestamps: true })



module.exports = mongoose.model('VehicleModel', vehicleSchema)

