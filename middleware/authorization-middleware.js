const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')


const UserModel = require('../models/user-model')

const AppError = require('../utlis/app-error')
const tryCatchAsync = require('../utlis/try-catch-async')




/*🔖 protect (we will use this function to protect any route that is not meant to be visit by a not logged in (or newly registered) user) */
const protect = tryCatchAsync(async (req, res, next) => {

    // Checking if there is a token in the headers or not
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get the access.', StatusCodes.UNAUTHORIZED))
    }



    // verifying the token 

    /*🔖 decoded will be an object which will have 'id', 'iat' & 'exp' property */

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)



    // the user belonging to the token exists or not on the database  after the token is issued (what if the user is deleted just after the token is issued)

    const authorizedUser = await UserModel.findById(decoded.id)

    if (!authorizedUser) {

        return next(new AppError('The user belonging to the token does no longer exist', StatusCodes.UNAUTHORIZED))

    }



    // if everything is ok, that means the user is authorized and can access the protected route

    // Before calling the next(), we want to create req.user because we  will need that in the next restrictTo middleware
    req.user = authorizedUser

    next()

})




/* 🔖 restrictTo (not every user has the same role in a application and they should only see the pages that is related to their role. We will use this function to restrict any route that is not meant to be viewed by a user. ) */

/*🔖 this restrictTo() function depends on the above protect() function because we are getting the most important value of this restrictTo() function from the protect() function. So, on any route, we can use this restrictTo() as a middleware only if we use the above protect() as the first middleware. */
const restrictTo = (...roles) => {

    return (req, res, next) => {

        // getting the req.user from the last 'protect' middleware
        if (!roles.includes(req.user.role)) {

            return next(new AppError('You do not have permission to perform this action', StatusCodes.FORBIDDEN))
        }

        next()
    }

}


module.exports = { protect, restrictTo }