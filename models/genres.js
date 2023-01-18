const Joi = require('joi')
const mongoose = require('mongoose')

const genreSchema = mongoose.Schema({
    genre: { type: String, required: true}
})

const Genres = mongoose.model('Genres', genreSchema)

// utility function
function validateCheck(genre){

    const schema = Joi.object({
        genre: Joi.string().min(3).required()
    })

    return schema.validate(genre)
}

module.exports = {Genres, validateCheck, genreSchema}