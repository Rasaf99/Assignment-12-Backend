const mongoose = require('mongoose')

const validator = require('validator')

const bcrypt = require('bcrypt')



const Schema = mongoose.Schema


const userSchema = new Schema({


    username: {
        type:String,
        required: true
    },

    email:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },


    password: {
        type:String,
        required: true,
        select:false,
        validate: [validator.isStrongPassword, 'Password must be 8 characters long. Password must have at least 1 lowercase letter, 1 uppercase letter, 1 numerical value & 1 symbol.']
    },

    passwordConfirm: {
        type: String,
        required: true
    },


    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin']
    },

})



// hash password before you save them on the database
userSchema.pre('save', async function(next){


    /* 🔖 only run this function if password was actually modified (or created for the first time) */
    if(!this.isModified('password')) return next()

    // hash the password 
    let salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)


    // delete passwordConfirm field 
    /* 🔖 we don't need to save this passwordConfirm property to the database. */
    this.passwordConfirm = undefined

    next()
})



// comparePassword method
userSchema.methods.comparePassword = async function(loginPassword, hashedPassword) {

    return await bcrypt.compare(loginPassword, hashedPassword)

}




// exporting model
module.exports = mongoose.model('UserModel', userSchema)


            