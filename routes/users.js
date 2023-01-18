const { User, validateUser } = require('../models/users')
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
    const { error } = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({email: req.body.email})
    if(user) return res.status(400).send("User already registered with email")

    user = await new User(
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin    
        }
    )

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(user.password, salt)
    user.password = hashed
    await user.save()

    const token = user.generateAuthToken()

    res.header('x-auth-token', token).send(_.pick(user, ["name", "email"]))
})


module.exports = router