import request from "supertest";

const baseUrl = "https://gorest.co.in/public/v2/";

const randomUser = require('../helper/random-user');

const TOKEN = "b2e25f393b1f5f8dc24e0a9f5e547b0fb2546057a9f9249e56baa4968dc5c2c1";

// todo: const a let
describe('CRUD user E2E positive scenario', () => {
    test('POST user', 
    async() => {
        let user;
        user = randomUser.getRandomBasicUser();
        const response = await request(baseUrl)
            .post('users')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(user);

        console.log(response.body);

        expect(response.statusCode).toBe(201);
    })
});