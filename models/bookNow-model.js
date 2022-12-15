const mongoose = require('mongoose');


const bookNowSchema = mongoose.Schema({

    vehicle_name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    meeting_location: {
        type: String,
        required: true
    },

    buyer_id: {
        type: String,
        required: true,
    },

    buyer_username:{
        type: String,
        required: true
    },

    buyer_email: {
        type: String,
        required: true
    },

    buyer_phone_number: {
        type: Number,
        required: true
    },



}, { timestamps: true })



module.exports = mongoose.model('BookNowModel', bookNowSchema)

