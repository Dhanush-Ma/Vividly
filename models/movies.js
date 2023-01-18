const mongoose = require('mongoose')
const {genreSchema} = require('./genres')
const Joi = require('Joi')


const movieSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        genre: {
            type: genreSchema,
            required: true
        },
        numberInStock: {
            type: Number,
            default: 0
        },
        displayRentalRate: {
            type: Number,
            default: 0
        }

    }
)

const Genre = mongoose.model('Genre', genreSchema)
const Movie = mongoose.model('Movie', movieSchema)

function validateMovie(movie){
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        genreID: Joi.string().required(),
        numberInStock: Joi.number().required,
        displayRentalRate: Joi.number().required
    })

    return schema.validate(movie)
}

module.exports = {Genre, Movie,validateMovie}
