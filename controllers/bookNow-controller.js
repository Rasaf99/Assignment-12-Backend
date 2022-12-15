const { StatusCodes } = require('http-status-codes')

const BookNowModel = require('../models/bookNow-model.js')


const AppError = require('../utlis/app-error.js')
const tryCatchAsync = require('../utlis/try-catch-async.js')





/* 

Description:  Search bookNow by buyers

Method: GET

Route: /api/v1/bookNow/buyer/:id

Access: Only Buyer
*/


const FetchBookNowByBuyer = tryCatchAsync(async (req, res, next) => {

        const { id } = req.params

        // checking whether any bookNow exits with that id or not
        const bookNow = await BookNowModel.find({ buyer_id: id })


        if (!bookNow) {

                return next(new AppError('No bookNow exits with that id', StatusCodes.NOT_FOUND))
        }


        res.status(StatusCodes.OK).json(bookNow)
})




/* 

Description:  Create a BookNow 

Method: POST

Route: /api/v1/bookNow

Access: Private


*/

const createBookNow = tryCatchAsync(async (req, res, next) => {

        const newBookNow = new BookNowModel(req.body);
        await newBookNow.save();

        res.status(StatusCodes.CREATED).json(newBookNow)
})





/* 

Description:  Delete a specific bookNow 

Method: DELETE

Route: /api/v1/bookNow/:id

Access: Private

*/


const deleteBookNow = tryCatchAsync(async (req, res, next) => {


        const { id } = req.params

        // trying to find the bookNow 
        const existsOrNot = await BookNowModel.findOne({ _id: id })


        if (!existsOrNot) {

                return next(new AppError('There is no bookNow with that id.', StatusCodes.NOT_FOUND))

        }

        const bookNow = await BookNowModel.findOneAndDelete({ _id: id })


        res.status(StatusCodes.OK).json(bookNow)

})







module.exports = { FetchBookNowByBuyer, createBookNow, deleteBookNow }