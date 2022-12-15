const fs = require('fs')

const {StatusCodes} = require('http-status-codes')
const cloudinary = require('cloudinary').v2


const VehicleModel = require('../models/vehicle-model.js')


const AppError = require('../utlis/app-error.js')
const tryCatchAsync = require('../utlis/try-catch-async.js')




/* 

Description:  Fetch all the  vehicles 

Method: GET

Route: /api/v1/vehicle

Access: Public

*/

const fetchVehicles = tryCatchAsync(async (req, res, next) => {

        let queriedVehicles = VehicleModel.find({}).sort({ createdAt: -1 })


        // pagination & limit
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 100
        const skip = (page - 1) * limit


        queriedVehicles = queriedVehicles.skip(skip).limit(limit)


        // if everything is ok
        const vehicles = await queriedVehicles

        res.status(StatusCodes.OK).json(vehicles)

})




/* 

Description:  Search vehicles by category

Method: GET

Route: /api/v1/vehicle/category/:id

Access: Public
*/


const searchVehiclesByCategory = tryCatchAsync(async (req, res, next) => {

        const { id } = req.params

        // checking whether any vehicle exits with that category or not
        const vehicle = await VehicleModel.find({ category: id })


        if (!vehicle) {

                return next(new AppError('No vehicle exits with that category', StatusCodes.NOT_FOUND))
        }


        res.status(StatusCodes.OK).json(vehicle)
})





/* 

Description:  Search vehicles by seller

Method: GET

Route: /api/v1/vehicle/seller/:id

Access: Public
*/


const searchVehiclesBySeller = tryCatchAsync(async (req, res, next) => {

        const { id } = req.params

        // checking whether any vehicle exits with that id or not
        const vehicle = await VehicleModel.find({ seller_id: id })


        if (!vehicle) {

                return next(new AppError('No vehicle exits with that id', StatusCodes.NOT_FOUND))
        }


        res.status(StatusCodes.OK).json(vehicle)
})




/* 

Description:  Create a Vehicle 

Method: POST

Route: /api/v1/vehicle

Access: Private


*/

const createVehicle = tryCatchAsync(async (req, res, next) => {


        const newVehicle = new VehicleModel(req.body);
        await newVehicle.save();

        res.status(StatusCodes.CREATED).json(newVehicle)
})





/* 

Description:  Delete a specific vehicle 

Method: DELETE

Route: /api/v1/vehicle/:id

Access: Private

*/


const deleteVehicle = tryCatchAsync(async (req, res, next) => {


        const { id } = req.params

        // trying to find the vehicle 
        const existsOrNot = await VehicleModel.findOne({ _id: id })


        if (!existsOrNot) {

                return next(new AppError('There is no vehicle with that id.', StatusCodes.NOT_FOUND))

        }

        const vehicle = await VehicleModel.findOneAndDelete({ _id: id })


        res.status(StatusCodes.OK).json(vehicle)

})




/* 

Description:  Update a specific vehicle 

Method: PATCH

Route: /api/v1/vehicle/:id

Access: Private

*/

const updateVehicle = tryCatchAsync(async (req, res, next) => {

        const { id } = req.params

        // trying to find the vehicle 
        const existsOrNot = await VehicleModel.findOne({ _id: id })


        if (!existsOrNot) {

                return next(new AppError('There is no vehicle with that id.', StatusCodes.NOT_FOUND))
        }


        const vehicle = await VehicleModel.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })


        res.status(StatusCodes.OK).json(vehicle)

})





/* 

Description:  Upload an image of a vehicle 

Method: POST

Route: /api/v1/vehicle/:id/image

Access: Private


*/

const uploadVehicleImage = tryCatchAsync(async (req, res, next) => {


        const { id: vehicleID } = req.params

        // trying to find the vehicle  
        const existsOrNot = await VehicleModel.findOne({ _id: vehicleID })

        if (!existsOrNot) {

                return next(new AppError('There is no vehicle with that id.', StatusCodes.NOT_FOUND))
        }


        
        // validation - no file is uploaded
        if (!req.files) {

                return next(new AppError('You have not uploaded any file', StatusCodes.NOT_FOUND))
        }

        // validation - tried to upload with a wrong property key
        if (!Object.hasOwn(req.files, 'vehicleImage')) {

                return next(new AppError('You may have tried to upload a file with a wrong property name(key).', StatusCodes.NOT_FOUND))
        }


        // getting the temporarily uploaded image on server
        const temporarilyUploadedImage = req.files.vehicleImage


        // validation - image or not
        if (!temporarilyUploadedImage.mimetype.startsWith('image')) {

                return next(new AppError('please upload an image', StatusCodes.UNSUPPORTED_MEDIA_TYPE))
        }


        // validation - accepted format or not
        const imageFormat = temporarilyUploadedImage.name.split(".")[1];

        if (!["jpg", "png", "jpeg"].includes(imageFormat)) {

                return next(new AppError('file extension must be jpg or png', StatusCodes.UNSUPPORTED_MEDIA_TYPE))
        }


        // validation - fileSize
        const fileSize = temporarilyUploadedImage.size / 1024;

        if (fileSize > 500) {

                return next(new AppError('file size must be lower than 500kb', StatusCodes.NOT_ACCEPTABLE))
        }


        // temporarily uploaded image's path
        const imageTempPath = temporarilyUploadedImage.tempFilePath


        // uploading the image on cloudinary
        const imageOnCloudinary = await cloudinary.uploader.upload(

                imageTempPath,

                {

                        folder: 'assignment-12',

                        use_filename: false,

                        public_id: vehicleID,
                 
                        unique_filename: false,
  
                        overwrite: true,
                }

        )

        const vehicleUpdate = await VehicleModel.findOneAndUpdate(

                { _id: vehicleID },
                { vehicle_image: imageOnCloudinary.secure_url }
        )


        fs.unlinkSync(imageTempPath)


        // success json response
        res.status(StatusCodes.OK).json({

                image_link: imageOnCloudinary.secure_url,

                updated_vehicle: vehicleUpdate._doc
        })


})





module.exports = { fetchVehicles, searchVehiclesByCategory, createVehicle, deleteVehicle, updateVehicle, uploadVehicleImage, searchVehiclesBySeller }