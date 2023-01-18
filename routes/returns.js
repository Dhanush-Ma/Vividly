const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {Rental} = require('../models/rentals')
const auth = require('../middleware/auth')
const {Movie} = require('../models/movies')
const Joi = require('joi')

router.post('/', auth, async (req,res) => {
    const { error } = validateCheck(req.body)

    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }

    if(!req.body.movieID) return res.status(400).send('movieID not provided')


    const rental = await Rental.findOne(
        {
            "customer._id": req.body.customerID,
            "movie._id": req.body.movieID
        }
    )

    if(!rental) return res.status(404).send("No Renatl found")

    if(rental.dateReturned) res.status(400).send("Return is alreday completed")

    rental.return()
    await rental.save()

    await Movie.updateOne({_id: rental.movie._id}, {
        $inc: { numberInStock: 1 }
    })


    return res.status(200).send(rental)

})

// utility function
function validateCheck(req){
    const schema = Joi.object({
        
        customerID: Joi.objectId().required(),
        movieID: Joi.objectId().required()
    })

    return schema.validate(req)
}

module.exports = router

