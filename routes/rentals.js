const { Rental, validateCheck } = require('../models/rentals')
const { Customer } = require('../models/customers')
const { Movie } = require('../models/movies')
const express = require('express')
const router = express.Router()
const Fawn = require('fawn')

// const mongoose = require('mongoose')
// const Fawn = require('fawn')
// mongoose.set('strictQuery', false)
// mongoose.connect("mongodb://127.0.0.1:27017/vividly")
// // Fawn.init("mongodb://127.0.0.1:27017/vividly") // do check

router.get('/', async(req, res) => {
    const rentals = await Rental.find().sort({dateOut: -1})
    res.status(200).send(rentals)
})

router.post('/', async(req,res) => {
    //custid movieid
    const { error } = validateCheck(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findById(req.body.customerID)
    if(!customer) return res.status(400).send("Invalid Customer")

    const movie = await Movie.findById(req.body.movieID)
    if(!movie) return res.status(400).send("Invalid Movie")

    if(movie.numberInStock === 0) return res.status(400).send("Movie Not in Stock")

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            displayRentalRate: movie.displayRentalRate
        }
    })

//     try {
//          Fawn.Task()
//             .save('rentals', rental)
//             .update('movies', {_id: movie._id}, {
//                 $inc: {numberInStock: -1}
//             })
//             .run()

//         res.send(rental)
//         console.log("hi")
//     } catch (error) {
//         console.log(error)
//         res.status(500).send(error)
//     }
        rental.save()
        movie.numberInStock--
        movie.save()
        res.send(rental)
})

module.exports = router


