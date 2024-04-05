const { faker } = require('@faker-js/faker');

export function getRandomBasicUser() {
    let data;
    data = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        gender: faker.person.sex(),
        status: getRandomStatus()

    }
    console.log(data);
    return data;
}

function getRandomStatus() {
    if (Math.random() >= 0.5)
        return 'active';
    else 
        return 'inactive';
}

module.exports = {getRandomBasicUser};