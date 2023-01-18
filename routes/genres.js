const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {Genres, validateCheck} = require('../models/genres')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/admin')

// Get Method for all existing genres
router.get('/', async (req,res) => {
    const genres = await Genres 
                            .find()
                            .sort({ genre: 1 })
    
    res.status(200).json(genres)
})

// Get Method for Specific genre
router.get('/:id', async (req, res) => {
    const genre = await Genres
                            .find({_id: req.params.id})
                            .catch((err) => console.log(err))
    
    if(!genre){
        res.status(404).send("Genre Not found! Sorry!")
        return
    }else{
         res.status(200).json(genre)
    }
})

// Post Method
router.post('/', auth, async (req,res) => {

    const { error } = validateCheck(req.body)

    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }else{
        const genre = {
            genre: req.body.genre
        }

        try{
           const insertedGenre = await new Genres(genre)
           const result = insertedGenre.save()
           res.status(200).json(insertedGenre)
        }catch(err){
            console.log(err.message)
        }
    }
})

// Update Method
router.put('/:id', async (req,res) => {
    // handle invalid genre type - 404
    const checkGenre = await Genres.find({
        _id: req.params.id
    })

    // handle invalid genre name - 400
    const result = validateCheck(req.body)
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return;
    }

    const updateGenre = await Genres.updateOne({_id: req.params.id}, {$set: {
        genre: req.body.genre
    }}, {new: true})
    
    if(updateGenre.modifiedCount == 0){
        res.status(404).send("Genre Not found! Sorry!")
        return;
    }
    
    res.status(200).send(updateGenre)
    
})



//delete Method
router.delete('/:id', [auth,authAdmin],async (req,res) => {
    // handle invalid genre type - 404
    const deleteGenre = await Genres.deleteOne({
        _id: req.params.id
    })

    if(!deleteGenre){
        res.status(404).send("Genre Not found! Sorry!")
        return;
    }

    res.status(200).json(deleteGenre)

})


module.exports = router