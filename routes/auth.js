const { User } = require('../models/users')
const Joi = require('joi')
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')

router.get('/', async (req,res) => {
    const users = await User.find()
    res.status(200).send(users)
})

router.get('/:id', async (req,res) => {
    const user = await User.findById(req.params.id)
    res.json(user)
})

router.post('/', async (req,res) => {
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("User not registered")

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send("Invalid Password")

    //JSON Web Token
    const token = user.generateAuthToken()
    res.send(token)
})


function validate(user){
    const schema = Joi.object(
        {
            email: Joi.string().required().email(),
            password: Joi.string().required()
        }
    )
    return schema.validate(user)
}


module.exports = router