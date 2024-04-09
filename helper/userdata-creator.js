import request from "supertest";
import { BASE_URL, TOKEN, STATUS_CREATED} from "../config/api";

const randomUser = require('../helper/userdata-generator');

async function create(userData) {
    let response = await request(BASE_URL)
        .post('users')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(userData)
        .expect(STATUS_CREATED);
    return response.body.id;
}

async function createPosts(userId) {
    let response = await request(BASE_URL)
        .post(`users/${userId}/posts`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(randomUser.generatePosts())
        .expect(STATUS_CREATED);
    return response.body.id;
};

async function createComments(userName, userEmail, postId) {
    await request(BASE_URL)
        .post(`posts/${postId}/comments`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(randomUser.generateComments(userName, userEmail, postId))
        .expect(STATUS_CREATED);
       
};

async function createTodos(userId) {
    await request(BASE_URL)
        .post(`users/${userId}/todos`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(randomUser.generateTodos())
        .expect(STATUS_CREATED);
}

module.exports = {create, createPosts, createTodos, createComments};