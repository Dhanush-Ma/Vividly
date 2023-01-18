const request = require('supertest')
const {Genres} = require('../../models/genres')
let server = ''

describe('/api/genres', () => {

    beforeEach(() => { server = require('../../index')})
    afterEach(async () => {
        await Genres.remove({})
        server.close()})

    describe('GET /', () => {
        it('should return all genres',async () => {

            await Genres.collection.insertMany([
                {name:'genre1'},
                {name: 'genre2'}
            ])

            const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === "genre1")).toBeTruthy()
            expect(res.body.some(g => g.name === "genre2")).toBeTruthy()

        })
    })

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () =>{
            const genre = new Genres({genre: 'genre1'})
            await genre.save()

            const res = await request(server).get('/api/genres/' + genre.id)
            expect(res.body).toHaveProperty('genre',genre.name)

        })
    })


})