import request from "supertest";

import { baseUrl, token } from "../config/api";

const randomUser = require('../helper/userdata-generator');
const userComparator = require('../helper/user-validator');

// todo: const vs let
describe('Create user', () => {
    
    test('simple positive scenario for creating user', 
    async() => {
        // given 
        let userId;
        
        // when
        const response = await postUser();
        userId = response.body.id;
       
        // then
        expect(response.statusCode).toBe(201);
       
        const createdUser = await request(baseUrl)
            .get(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
       
     userComparator.compareBasicUserData(response.body, createdUser.body);
        
    });

    test('positive scenario for creating user and his posts', 
    async() => {
        // given 
        let userId;
        let userPost = randomUser.getUserPost();
       
      // when
        const response = await postUser();
        userId = response.body.id;
        
        const responsePost = await request(baseUrl)
            .post(`users/${userId}/posts`)
            .set('Authorization', `Bearer ${token}`)
            .send(userPost);
            console.log(userPost);
     
        // then
        expect(responsePost.statusCode).toBe(201);
       
       
        const createdUser = await request(baseUrl)
            .get(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        userComparator.compareBasicUserData(response.body, createdUser.body);
        userComparator.comparePosts(userPost, userPost);

    });

    async function postUser() {
        let user = randomUser.getRandomBasicUserData();
        
        // when
        return await request(baseUrl)
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(user);
    }
});