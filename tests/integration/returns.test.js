const request = require('supertest')
const {Rental} = require('../../models/rentals')
const mongoose = require('mongoose')
const {User} = require('../../models/users')
const {Movie} = require('../../models/movies')

const moment = require ('moment')

let server;
let customerID;
let movieID;
let rental;
let token;

describe('/api/genres', () => {

    const exec = () => {
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerID, movieID})
    }

    beforeEach(async () => { 
        server = require('../../index')
        customerID = mongoose.Types.ObjectId()
        movieID = mongoose.Types.ObjectId()
        token =  new User().generateAuthToken()

        rental = new Rental({
            customer:{
                _id: customerID,
                name: "12345",
                phone: "12345"
            },
            movie:{
                _id: movieID,
                title: '12345',
                dailyRentalRate: 2
            }
        })

        await rental.save()
    })
    afterEach(async () => {
        await Rental.remove({})
        await Movie.remove({})
        await server.close()})

    it('should return 401 if client not logged in', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401)
    })

    it('should return 400 if customerID is not provided', async () => {
        customerID = ''
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 400 if movieID is not provided', async () => {
        
        movieID = ''
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 404 if no rental is not found for combination', async () => {
        await Rental.remove({})

        const res = await exec()
        expect(res.status).toBe(404)
    })

    it('should return 400 if return is already processed', async () => {
        rental.dateReturned = new Date()
        await rental.save()

        const res = await exec()
        expect(res.status).toBe(400)
    })

    // it('should return 200 if a valid request', async () => {
    //     const res = await exec()
    //     expect(res.status).toBe(200)
    // })

    it('should set the returnDate if valid', async () => {
        const res = await exec()

        const rentalDB = await Rental.findById(rental._id)
        const diff = new Date() - rentalDB.dateReturned
        expect(diff).toBeLessThan(10 * 1000)
    })

    // it('should set the rental fee if valid', async () => {

    //     rental.dateOut = moment().add(-7, 'days').toDate()
    //     await rental.save()

    //     const res = await exec()
        
    //     const rentalDB = await Rental.findById(rental._id)
    //     expect(rentalDB.rentalFee).toBe(14)
    // })

})


/*

// POST /api/returns {customerID, movieID}

Return 401 if customer is not logged in
Return 400 if customerID is not provided
Return 400 if movieID is not provided
Return 404 if no rental found for this combo
Return 400 if rental already processed

Return 200 if valid
{
    set return date
    set rental fee
    increase the stock in Movie
    Return the rental Summary
}


*/