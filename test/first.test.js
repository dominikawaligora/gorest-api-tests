import request from "supertest";

const baseUrl = "https://gorest.co.in/public/v2/";
describe('get users', () => {
    test.only('should return 200 status code',
    async() => {
        const response = await request(baseUrl).get('users');
        expect(response.statusCode).toBe(200);
    });
});