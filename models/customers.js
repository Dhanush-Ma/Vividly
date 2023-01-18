const Joi = require('joi')
const mongoose = require('mongoose')

const customerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 4
        },
        phone: {
            type: String,
            required: true
        },
        isGold: {
            type: Boolean,
            default: false
        }
    }
)

const Customer = mongoose.model('customer', customerSchema )

// utility function
function validateCheck(customer){

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        phone: Joi.string().max(10).min(10).required()
    })

    return schema.validate(customer)
}

module.exports = {Customer ,validateCheck }