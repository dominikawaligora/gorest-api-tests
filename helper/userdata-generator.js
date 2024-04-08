const { faker } = require('@faker-js/faker');

import { baseUrl, token } from "../config/api";


export function getRandomBasicUserData() {
    let data;
    data = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        gender: faker.person.sex(),
        status: getRandomStatus()
    }

    return data;
}

function getRandomStatus() {
    if (Math.random() >= 0.5)
        return 'active';
    else 
        return 'inactive';
}

export async function createRandomUser() {
    let userData = getRandomBasicUserData();
    let response = await await request(baseUrl)
        .post('users')
        .set('Authorization', `Bearer ${token}`)
        .send(user);

    return response.body.data;
}

export function getUserPost() {
    let data;
    data = {
        title: faker.lorem.sentence(3, 10),
        body: faker.lorem.text()
    }
   return data;
}


module.exports = {getRandomBasicUserData, createRandomUser, getUserPost};