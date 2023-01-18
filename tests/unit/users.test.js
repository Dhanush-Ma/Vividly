const {User} = require('../../models/users')
const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')

describe('generateAuthToken', () => {
    it('should return wheter a JWT is validate', () => {
        const payload = {_id:mongoose.Types.ObjectId(), isAdmin:true}
        const user = new User(payload)
        const token = user.generateAuthToken()
        const verify  = jwt.verify(token, config.get('jwtPrivateKey'))

        expect(verify).toMatchObject(payload)
    })
})
