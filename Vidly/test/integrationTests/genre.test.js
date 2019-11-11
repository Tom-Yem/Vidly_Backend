const request = require('supertest');
const { Genre} = require('../../models/genre');
const { User} = require('../../models/user');
let server;

describe('/genres', () =>{
    beforeEach( () =>{ server = require('../../server')});
    afterEach( async() => { 
        server.close();
        await Genre.remove({});
    });

    describe('GET /', () =>{
        Genre.insertMany([
            { name: 'genre1'},
            { name: 'genre2'}
        ]);
        
        it('should return all genres', async() =>{
              const res = await request(server).get('/genres');
              expect(res.status).toBe(200);
              expect(res.body.some(g => g.name=== 'genre1')).toBeTruthy();
              expect(res.body.some(g => g.name=== 'genre2')).toBeTruthy();

        })
    })

    describe('Get /:id', () =>{
        it('should return a genre when provided a valid id', async() =>{
            const genre = new Genre({ name: 'genre1'});
            await genre.save();
    
            const res = await request(server).get('/genres/' + genre._id);
    
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        })

        it('should return a 404 error when id is invalid', async() =>{    
            const res = await request(server).get('/genres/1');
    
            expect(res.status).toBe(404);
        })

        
    })

    describe('Post /', () =>{
        let token;
        let name;

        const exec = async() =>{
            return await request(server)
            .post('/genres')
            .set('x-auth-token', token)
            .send({name});

        }

        beforeEach( () =>{
            token = new User().generateAuthToken();
            name = 'genre1'
        })

        it('should return 400 error if user not logged in', async() =>{
            token = '';
            const res = await exec();

            expect(res.status).toBe(400);
        }) 
        it('should return 400 error if genre is less than 5 characters', async() =>{
            name = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        }) 

        it('should save the genre if the input is valid', async() =>{
            
            await exec();
            const genre = await Genre.find({name: 'genre1'})

            expect(genre).not.toBeNull();
        }) 

        it('should return the genre if the input is valid', async() =>{

            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name');

        }) 


 
    })
})