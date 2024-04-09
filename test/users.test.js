import request from "supertest";
import { baseUrl, token } from "../config/api";

const randomUser = require('../helper/userdata-generator');

describe('CREATE and READ user', () => {
    
    test('simple positive scenario for creating user', 
    async() => {
        await postUserAndVerify();
    });

    test('positive scenario for creating user with external resources', 
    async() => {
        // given 
        let userId;
        let userPost = randomUser.generatePosts();
        let userTodos = randomUser.generateTodos();
       
        // when
        userId = await postUserAndVerify();
       
        await request(baseUrl)
            .post(`users/${userId}/posts`)
            .set('Authorization', `Bearer ${token}`)
            .send(userPost)
            .expect(201);

        await request(baseUrl)
            .post(`users/${userId}/todos`)
            .set('Authorization', `Bearer ${token}`)
            .send(userTodos)
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

            await request(baseUrl)
                .get(`users/${userId}/todos`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(response => {
                    expect(response.body[0].title).toBe(userTodos.title);
                    expect(response.body[0].status).toBe(userTodos.status);
                    expect(response.body[0].user_id).toBe(userId);
              
            });
    });
        
    test('negative scenario to send empty request',
    async() => {
        // given 
       
        let expectedEmail = "{\"field\":\"email\",\"message\":\"can't be blank\"}";
        let expectedName = "{\"field\":\"name\",\"message\":\"can't be blank\"}";
        let expectedStatus = "{\"field\":\"status\",\"message\":\"can't be blank\"}";
        let expectedGender = "{\"field\":\"gender\",\"message\":\"can't be blank, can be male of female\"}"; // need to adjust error message after defect is fixed

        // when
        // then
        await request(baseUrl)
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send("{}")
            .expect(422)
            .then(response => {
                expect(response.text).toContain(expectedEmail);
                expect(response.text).toContain(expectedName);
                expect(response.text).toContain(expectedGender);
                expect(response.text).toContain(expectedStatus);
            });
    });

    test('negative scenario for creating user with icorrect gender',
    async() => {
        // given 
        let user = {
            email: randomUser.generateEmail(),
            name: randomUser.generateName(),
            staus: randomUser.generateStatus(),
            gender: "incorrect"
        };

        // todo
        let expectedGender = "{\"field\":\"gender\",\"message\":\"can't be blank, can be male of female\"}"; // need to adjust error message after defect is fixed

        // when
        await request(baseUrl)
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(422)
            .then(response => {
                expect(response.text).toContain(expectedGender);
            });

    });


    test('negative scenario for creating user with icorrect status',
    async() => {
        // given 
        let user = {
            email: randomUser.generateEmail(),
            name: randomUser.generateName(),
            staus: "incorrect",
            gender: randomUser.generateGender()
        };
        // todo
        let expectedStatus = "{\"field\":\"status\",\"message\":\"can't be blank\"}"; // to correct when defect is fixed
        
        // when
        await request(baseUrl)
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(422)
            .then(response => {
                expect(response.text).toContain(expectedStatus);
            });
       
    });

    test('negative scenario for creating user with icorrect email',
    async() => {
        // given 
        let user = {
            email: "incorrect",
            name: randomUser.generateName(),
            staus: randomUser.generateStatus(),
            gender: randomUser.generateGender()
        };
        // todo
        let expectedEmail = "{\"field\":\"email\",\"message\":\"is invalid\"}";
        
        // when
        await request(baseUrl)
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(422)
            .then(response => {
                expect(response.text).toContain(expectedEmail);
            });

    });


    async function postUserAndVerify() {
        // given 
        let user = randomUser.generateRandomData();
        
        // when
        let response = await request(baseUrl)
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(201);

          
        // then
        await request(baseUrl)
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


describe('UPDATE and READ user', () => {
    test('positive scenario for updating all user data',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await postUser(userData);
        let newUserData = randomUser.generateRandomData();
        
        // when
        await request(baseUrl)
            .put(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newUserData)
            .expect(200);
        
        // then
        await request(baseUrl)
            .get(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(response => {
                expect(response.body.id).toBe(response.body.id);
                expect(response.body.email).toBe(newUserData.email);
                expect(response.body.name).toBe(newUserData.name);
                expect(response.body.gender).toBe(newUserData.gender);
                expect(response.body.status).toBe(newUserData.status);
            });
    });

    test('positive scenario for updating user email',
    async() => {
         // given
         let userData = randomUser.generateRandomData();
         let userId = await postUser(userData);
         let newUserData = {
            email: randomUser.generateEmail()
         }
         
         // when
         await request(baseUrl)
             .patch(`users/${userId}`)
             .set('Authorization', `Bearer ${token}`)
             .send(newUserData)
             .expect(200);
         
         // then
         await request(baseUrl)
             .get(`users/${userId}`)
             .set('Authorization', `Bearer ${token}`)
             .expect(200)
             .then(response => {
                 expect(response.body.id).toBe(response.body.id);
                 expect(response.body.email).toBe(newUserData.email);
                 expect(response.body.name).toBe(userData.name);
                 expect(response.body.gender).toBe(userData.gender);
                 expect(response.body.status).toBe(userData.status);
             });
    });

    test('positive scenario for updating user name',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await postUser(userData);
        let newUserData = {
           name: randomUser.generateName()
        }
        
        // when
        await request(baseUrl)
            .patch(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newUserData)
            .expect(200);
        
        // then
        await request(baseUrl)
            .get(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(response => {
                expect(response.body.id).toBe(response.body.id);
                expect(response.body.email).toBe(userData.email);
                expect(response.body.name).toBe(newUserData.name);
                expect(response.body.gender).toBe(userData.gender);
                expect(response.body.status).toBe(userData.status);
            });
    });

    test('positive scenario for updating user status',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await postUser(userData);
        let newUserData = {
           status: (userData.status = "active") ? "inactive" : "active"
        }
        
        // when
        await request(baseUrl)
            .patch(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newUserData)
            .expect(200);
        
        // then
        await request(baseUrl)
            .get(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(response => {
                expect(response.body.id).toBe(response.body.id);
                expect(response.body.email).toBe(userData.email);
                expect(response.body.name).toBe(userData.name);
                expect(response.body.gender).toBe(userData.gender);
                expect(response.body.status).toBe(newUserData.status);
            });

    });

    test('negative scenario to PUT update not existing user',
    async() => {
        // given
        let newUserData = randomUser.generateRandomData();
        // todo
        let expectedError = "{\"message\":\"Resource not found\"}"
        
        // when
        // then
        await request(baseUrl)
            .put(`users/NotExisting`)
            .set('Authorization', `Bearer ${token}`)
            .send(newUserData)
            .expect(404)
            .then(response => {
                expect(response.text).toContain(expectedError);
            });
    });

    test('negative scenario to PATCH update not existing user',
    async() => {
        // given
        let newUserData = {
            name: randomUser.generateName
        };
        let expectedError = "{\"message\":\"Resource not found\"}"
        
        // when
        // then
        await request(baseUrl)
            .patch(`users/NotExisting`)
            .set('Authorization', `Bearer ${token}`)
            .send(newUserData)
            .expect(404)
            .then(response => {
                expect(response.text).toContain(expectedError);
            });
    });

    test('negative scenario to update with incorrect email',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await postUser(userData);
        let newUserData = {
            email: "someStrangeValue"
        };
        // todo
        let expectedError =  "{\"field\":\"email\",\"message\":\"is invalid\"}"
        
        // when
        // then
        await request(baseUrl)
            .patch(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newUserData)
            .expect(422)
            .then(response => {
                expect(response.text).toContain(expectedError);
            });;
    });

    
    test('negative scenario to update with incorrect status',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await postUser(userData);
        let newUserData = {
            status: "someStrangeValue"
        };
        // todo
        let expectedError =  "{\"field\":\"status\",\"message\":\"can't be blank\"}"  // error message need to be adjusted after bug is fixed
        
        // when
        // then
        await request(baseUrl)
            .patch(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newUserData)
            .expect(422)
            .then(response => {
                expect(response.text).toContain(expectedError);
            });
    });

    test('negative scenario to update with incorrect gender',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await postUser(userData);
        let newUserData = {
            gender: "someStrangeValue"
        };
        // todo
        let expectedError =  "{\"field\":\"gender\",\"message\":\"can't be blank, can be male of female\"}" // need to be changed after bug is fixed
        
        // when
        // then
        await request(baseUrl)
            .patch(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newUserData)
            .expect(422)
            .then(response => {
                expect(response.text).toContain(expectedError);
            });
    });

    async function postUser(userData) {
        let response = await request(baseUrl)
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(userData)
            .expect(201);
        return response.body.id;
    }
        
});