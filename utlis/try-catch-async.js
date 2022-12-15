const {StatusCodes} = require('http-status-codes')

const AppError = require("./app-error")


const tryCatchAsync = (fn) => {

    return async (req, res, next) => {

        try {

            await fn(req, res, next)
        }

        catch (error) {

            return next(new AppError(error.message, StatusCodes.NOT_FOUND, error))
            
        }
    }

}


module.exports = tryCatchAsync