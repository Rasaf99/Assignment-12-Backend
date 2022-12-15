const express = require('express')

const router = express.Router()

const {signupUser, loginUser} = require('../controllers/auth-controller')



// signup route
router.route('/signup').post(signupUser)


// login route
router.route('/login').post(loginUser)



module.exports = router 