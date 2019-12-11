const request = require('supertest');

const app = require('../../src/app');
const factory = require('../factories');
const truncate = require('../utils/truncate');


describe('Authentication',()=>{
    beforeEach(async()=>{
        await truncate();
    });

    it('should authemticate with valid credentials', async ()=>{
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app)
        .post('/session')
        .send({
            email: user.email,
            password: '123123'
        });

        expect(response.status).toBe(200);
    });


    it('should not authenticate with invalid credentials', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app)
        .post('/session')
        .send({
            email: user.email,
            password: '321321'
        });

        expect(response.status).toBe(401);
    })

    it('Deve retornar jwt token quando autenticado', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app)
        .post('/session')
        .send({
            email: user.email,
            password: '123123'
        });

        expect(response.body).toHaveProperty('token')
    })

    it('Pode acessar rotas quando autenticado', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${user.generateToken()}`)


        expect(response.status).toBe(200);
    })

    it('Não pode acessar rotas quando não autenticado', async () => {
        const response = await request(app)
        .get('/dashboard')

        expect(response.status).toBe(401);
    })

    it('Não pode acessar rotar com um token jwt invalido', async() => {
        const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer 123123`)


        expect(response.status).toBe(401);
    })
})



