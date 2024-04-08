import request from "supertest";

import { baseUrl, token } from "../config/api";

const randomUser = require('../helper/userdata-generator');

// todo: const vs let
describe('/POST User', () => {
    
    test('simple positive scenario for creating user', 
    async() => {
        // given 
        let userId;
        let user = randomUser.getRandomBasicUserData();
        
       // when
        const response = await request(baseUrl)
           .post('users')
           .set('Authorization', `Bearer ${token}`)
           .send(user)
           .expect(201);

        userId = response.body.id;
       
        // then
       await request(baseUrl)
            .get(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(response => {
                expect(response.body.id).toBe(userId);
                expect(response.body.email).toBe(user.email);
                expect(response.body.name).toBe(user.name);
                expect(response.body.gender).toBe(user.gender);
                expect(response.body.status).toBe(user.status);
            });
    });

    test('positive scenario for creating user with posts', 
    async() => {
        // given 
        let userId;
        let userPost = randomUser.getUserPost();
       
        // when
        userId = await postUserAndVerify();
       
        const responsePost = await request(baseUrl)
            .post(`users/${userId}/posts`)
            .set('Authorization', `Bearer ${token}`)
            .send(userPost)
            .expect(201);
          
     
        // then
        await request(baseUrl)
            .get(`users/${userId}/posts`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(response => {
                expect(response.body[0].title).toBe(userPost.title);
                expect(response.body[0].body).toBe(userPost.body);
                expect(response.body[0].user_id).toBe(userId);
              
            });

     

    });

    async function postUserAndVerify() {
        // given 
        let user = randomUser.getRandomBasicUserData();
        
        // when
        const response = await request(baseUrl)
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(201);

          
        // then
        const createdUser = await request(baseUrl)
            .get(`users/${response.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(response => {
                expect(response.body.id).toBe(response.body.id);
                expect(response.body.email).toBe(user.email);
                expect(response.body.name).toBe(user.name);
                expect(response.body.gender).toBe(user.gender);
                expect(response.body.status).toBe(user.status);
            });
        return response.body.id;
    }

});