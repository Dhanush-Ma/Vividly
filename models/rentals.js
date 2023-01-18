const Joi = require('joi')
const mongoose = require('mongoose')
const moment = require('moment')


const rentanlSchema = mongoose.Schema(
    {
        customer:{
            _id:{
                type: mongoose.Types.ObjectId
            },
            name: {
                    type: String,
                    required: true,
                    min: 4
                },
            phone: {
                type: String,
                required: true
            }
        },
        movie:{
            _id: {
                type: mongoose.Types.ObjectId
            },
            title: {
                type: String,
                required: true
            },
            displayRentalRate: {
                type: Number,
                default: 0,
                required: true
            }

        },
        dateOut: {
            type: Date,
            default: Date.now
        },
        dateReturned:{
            type: Date
        },
        rentalFee:{
            type: Number,
            min: 0
        }

    }
)

rentanlSchema.methods.return = function(){
    this.dateReturned = new Date()
    const rentalDays = moment().diff(this.dateOut, 'days')
    this.rentalFee = this.movie.dailyRentalRate * rentalDays
}

const Rental = mongoose.model("Rental", rentanlSchema)

function validateCheck(rental){
    const schema = Joi.object(
        {
            customerID: Joi.string().required(),
            movieID: Joi.string().required()
        }
    )
    return schema.validate(rental)
}

module.exports = { validateCheck, Rental }