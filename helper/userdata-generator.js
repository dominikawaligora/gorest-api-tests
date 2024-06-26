const { faker } = require('@faker-js/faker');

export function generateRandomData() {
    return {
        email: generateEmail(),
        name: generateName(),
        gender: generateGender(),
        status: generateStatus()
    }
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
    return {
        title: faker.lorem.sentence(3, 10),
        body: faker.lorem.text()
    }
}

export function generateTodos() {
   return {
        title: faker.lorem.sentence(3, 10),
        status: getRandomTodoStatus()
    }
}

export function generateComments(userName, userEmail, postId) {
  return {
        post: postId,
        name: userName,
        email: userEmail,
        body: faker.lorem.sentence(10,20),
    }
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


module.exports = {generateRandomData, generatePosts, generateTodos, generateComments, generateName, generateEmail, generateGender, generateStatus};