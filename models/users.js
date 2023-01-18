const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        isAdmin:{
            type: Boolean
        }
    }
)

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get("jwtPrivateKey"))
        
    return token
}

const User = mongoose.model('User', userSchema)

function validateUser(user){
    const schema = Joi.object(
        {
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().required(),
            isAdmin: Joi.boolean().required()
        }
    )
    return schema.validate(user)
}

module.exports = { User, validateUser }