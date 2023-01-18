const express = require('express')
const router = express.Router()
const { Genre, Movie, validateMovie } = require('../models/movies')


// Get Method for all existing genres
router.get('/', async (req,res) => {
    const movies = await Movie 
                            .find()
                            .sort({ title: 1 })
    
    res.status(200).json(movies)
})

// Get Method for Specific genre
router.get('/:id', async (req, res) => {
    const movie = await Movie
                            .find({_id: req.params.id})
                            .catch((err) => console.log(err))
    
    if(!movie){
        res.status(404).send("Movie Not found! Sorry!")
        return
    }else{
         res.status(200).json(movie)
    }
})

// Post Method
router.post('/', async (req,res) => {

    const { error } = validateMovie(req.body)

    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }

    const genre = await Genre.findById(req.body.genreID)
    if(!genre) { res.status(400).send("Genre not found Sorry") }


        const movie = {
            title: req.body.title,
            genre: {
                _id: genre._id,
                genre: genre.genre
            }

        }

        try{
           const insertedMovie = await new Movie(movie)
           const result = insertedMovie.save()
           res.status(200).json(insertedMovie)
        }catch(err){
            console.log(err.message)
        }
    
})

// Update Method
router.put('/:id', async (req,res) => {
    // handle invalid genre type - 404
    const checkMovie = await Movie.find({
        _id: req.params.id
    })
    if(!checkMovie) { res.status(400).send("Movie not Found")}


    const genre = await Genre.findById(req.body.genreID)
    if(!genre) { res.status(400).send("Genre not found Sorry") }

    // handle invalid genre name - 400
    const result = validateMovie(req.body)
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return;
    }

    const updateMovie = await Movie.updateOne({_id: req.params.id}, {$set: {
        title: req.body.title,
        genre: {
            genreID: genre._id,
            genre: genre.genre
        }
    }}, {new: true})
    
    if(updateMovie.modifiedCount == 0){
        res.status(404).send(" Not found! Sorry!")
        return;
    }
    
    res.status(200).send(updateMovie)
    
})



//delete Method
router.delete('/:id', async (req,res) => {
    // handle invalid genre type - 404
    const deleteMovie = await Movie.deleteOne({
        _id: req.params.id
    })

    if(!deleteMovie){
        res.status(404).send("Movie Not found! Sorry!")
        return;
    }

    res.status(200).json(deleteMovie)

})


module.exports = router