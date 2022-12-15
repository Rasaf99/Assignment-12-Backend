const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')


const UserModel = require('../models/user-model')

const AppError = require('../utlis/app-error')
const tryCatchAsync = require('../utlis/try-catch-async')



// jwt sign token function
const signToken = (id) => {

  return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN

  })

}



/* 

Description:  Sign up a user

Method: POST

Route: api/v1/auth/signup

Access: Public

*/


const signupUser = tryCatchAsync(async (req, res, next) =>{

        const {username, email, password, passwordConfirm, role} = req.body

        /*🔖 In the following, I could have pass the the whole req.body:
    
            const newUser = new UserModel({...req.body})

            But I didn't do it because the frontend developer will be able to pass anything with the req.body. So, I am destructuring first and passing all the properties one by one. 
        */

        const newUser = new UserModel({username, email, password, passwordConfirm, role})

        await newUser.save()


        const token = signToken(newUser._id)


        res.status(StatusCodes.CREATED).json({
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            token
        })


    })






/* 
Description:  Login a user

Method: POST

Route: api/v1/auth/login

Access: Public

*/


const loginUser = tryCatchAsync(async(req, res, next) => {


        // check if the user has provided the email and password    
        const {email, password} = req.body

        if(!email || !password ) {
            return next(new AppError('Please provide both your email and password', StatusCodes.NOT_FOUND))
        }


        // Check if user exists 
        /* 🔖 In the following, we can see that we are selecting the password. But why?

          In the userModel, on the password object, select property's value has been set as boolean false so that every time we want show all the info of a user, we don't show password there. So, password is actually hidden. So, now even when we need to work with password, we will need to use the select property to specifically select the password. 
    
        */

        const user = await UserModel.findOne({email}).select('+password')

        // check if password is correct
        let correctPassword;
        if(user) {
           correctPassword = await user.comparePassword(password, user.password)
        }

        // If either user doesn't exist or password doesn't match, send an error message

        /* 🔖 We don't want to specifically say which one is incorrect because that can help a hacker.*/

        if(!user || !correctPassword) {
            return next(new AppError('Incorrect Email or Password', StatusCodes.UNAUTHORIZED))
        }


        // If everything's ok, send token to client
        const token = signToken(user._id)

        res.status(StatusCodes.OK).json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        })



    })




module.exports = {signupUser, loginUser}

