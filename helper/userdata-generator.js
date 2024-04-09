const { faker } = require('@faker-js/faker');

import { baseUrl, token } from "../config/api";

import request from "supertest";


export function generateRandomData() {
    let data;
    data = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        gender: faker.person.sex(),
        status: getRandomStatus()
    }

    return data;
}

export function generateEmail() {
    return faker.internet.email();
}

export function generateName() {
    return faker.person.fullName();
}

export function generateGender() {
    return faker.person.sex();
}

export function generateStatus() {
    return getRandomStatus();
}

export function generatePosts() {
    let data;
    data = {
        title: faker.lorem.sentence(3, 10),
        body: faker.lorem.text()
    }
   return data;
}

export function generateTodos() {
    let data;
    data = {
        title: faker.lorem.sentence(3, 10),
        status: getRandomTodoStatus()
    }
   return data;
}

function getRandomStatus() {
    if (Math.random() >= 0.5)
        return 'active';
    else 
        return 'inactive';
}

function getRandomTodoStatus() {
    if (Math.random() >= 0.5)
        return 'pending';
    else 
        return 'completed';
}


module.exports = {generateRandomData, createRandomUser, generatePosts, generateTodos, generateName, generateEmail, generateGender, generateStatus};