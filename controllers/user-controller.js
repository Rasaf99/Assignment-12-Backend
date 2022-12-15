const {StatusCodes} = require('http-status-codes')

const UserModel = require('../models/user-model')

const AppError = require('../utlis/app-error')
const tryCatchAsync = require('../utlis/try-catch-async')


/* 

Description:  Get all the users' info

Method: GET

Route: /api/v1/user/

Access: Private (Only admin)


*/

const getAllUsers = tryCatchAsync(async (req, res, next) => {

    const users = await UserModel.find()

    // Send response
    res.status(200).json({
        results: users.length,
        users: users
    })


})



/* 

Description:  Get users by role

Method: GET

Route: /api/v1/user/role/:id

Access: Private (Only admin)


*/


const getUsersByRole = tryCatchAsync(async (req, res, next) => {

    const { id } = req.params

    const users = await UserModel.find({ role: id})

    
    if (!users) {

        return next(new AppError('No users exit with that role', StatusCodes.NOT_FOUND))
    }


    res.status(StatusCodes.OK).json(users)


})






/* 

Description: Get a specific users' info

Method: GET

Route: /api/v1/user/:id

Access: Private (Admin & and only the user himself)


*/

const getASpecificUser = tryCatchAsync(async (req, res, next) => {


    // checking whether any user exits with that id or not
    const { id: paramsID } = req.params

    const user = await UserModel.findOne({ _id: paramsID })

    if (!user) {
        return next(new AppError('No user exists with this id', StatusCodes.NOT_FOUND))
    }

    // Send response
    res.status(200).json({ user: user })

})




/* 

Description:  Delete a specific user 

Method: DELETE

Route: /api/v1/user/:id

Access: Only Admin

*/


const deleteUser = tryCatchAsync(async (req, res, next) => {


    const { id } = req.params

    // trying to find the bookNow 
    const existsOrNot = await UserModel.findOne({ _id: id })


    if (!existsOrNot) {

            return next(new AppError('There is no user with that id.', StatusCodes.NOT_FOUND))

    }

    const user = await UserModel.findOneAndDelete({ _id: id })


    res.status(StatusCodes.OK).json(user)

})








module.exports = { getAllUsers, getUsersByRole, getASpecificUser, deleteUser }