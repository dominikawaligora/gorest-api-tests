import request from "supertest";
import { BASE_URL, TOKEN, STATUS_CREATED, STATUS_OK, STATUS_NO_CONTENT, STATUS_DATA_VALIDATION_FAILED, STATUS_NOT_FOUND } 
    from "../config/api";

const randomUser = require('../helper/userdata-generator');
const newUser = require('../helper/userdata-creator');

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
      
        let postResonse = await request(BASE_URL)
            .post(`users/${userId}/posts`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(userPost)
            .expect(STATUS_CREATED);
        let postId = postResonse.body.id;

        await request(BASE_URL)
            .post(`users/${userId}/todos`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(userTodos)
            .expect(STATUS_CREATED);

        let userComments = randomUser.generateComments(randomUser.generateName(), randomUser.generateEmail(), postId);
        
        await request(BASE_URL)
            .post(`posts/${postId}/comments`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(userComments)
            .expect(STATUS_CREATED);

        
          
        // then
        await request(BASE_URL)
            .get(`users/${userId}/posts`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(STATUS_OK)
            .then(response => {
                expect(response.body[0].title).toBe(userPost.title);
                expect(response.body[0].body).toBe(userPost.body);
                expect(response.body[0].user_id).toBe(userId);
              
            });

            await request(BASE_URL)
                .get(`users/${userId}/todos`)
                .set('Authorization', `Bearer ${TOKEN}`)
                .expect(STATUS_OK)
                .then(response => {
                    expect(response.body[0].title).toBe(userTodos.title);
                    expect(response.body[0].status).toBe(userTodos.status);
                    expect(response.body[0].user_id).toBe(userId);
            });

            await request(BASE_URL)
                .get(`posts/${postId}/comments`)
                .set('Authorization', `Bearer ${TOKEN}`)
                .expect(STATUS_OK)
                .then(response => {
                    expect(response.body[0].name).toBe(userComments.name);
                    expect(response.body[0].email).toBe(userComments.email);
                    expect(response.body[0].body).toBe(userComments.body);
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
        await request(BASE_URL)
            .post('users')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send("{}")
            .expect(STATUS_DATA_VALIDATION_FAILED)
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
        await request(BASE_URL)
            .post('users')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(user)
            .expect(STATUS_DATA_VALIDATION_FAILED)
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
        await request(BASE_URL)
            .post('users')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(user)
            .expect(STATUS_DATA_VALIDATION_FAILED)
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
        await request(BASE_URL)
            .post('users')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(user)
            .expect(STATUS_DATA_VALIDATION_FAILED)
            .then(response => {
                expect(response.text).toContain(expectedEmail);
            });

    });


    async function postUserAndVerify() {
        // given 
        let user = randomUser.generateRandomData();
        
        // when
        let response = await request(BASE_URL)
            .post('users')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(user)
            .expect(STATUS_CREATED);

          
        // then
        await request(BASE_URL)
            .get(`users/${response.body.id}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(STATUS_OK)
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
        let userId = await newUser.create(userData);
        let newUserData = randomUser.generateRandomData();
        
        // when
        await request(BASE_URL)
            .put(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(newUserData)
            .expect(STATUS_OK);
        
        // then
        await request(BASE_URL)
            .get(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(STATUS_OK)
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
         let userId = await newUser.create(userData);
         let newUserData = {
            email: randomUser.generateEmail()
         }
         
         // when
         await request(BASE_URL)
             .patch(`users/${userId}`)
             .set('Authorization', `Bearer ${TOKEN}`)
             .send(newUserData)
             .expect(STATUS_OK);
         
         // then
         await request(BASE_URL)
             .get(`users/${userId}`)
             .set('Authorization', `Bearer ${TOKEN}`)
             .expect(STATUS_OK)
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
        let userId = await newUser.create(userData);
        let newUserData = {
           name: randomUser.generateName()
        }
        
        // when
        await request(BASE_URL)
            .patch(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(newUserData)
            .expect(STATUS_OK);
        
        // then
        await request(BASE_URL)
            .get(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(STATUS_OK)
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
        let userId = await newUser.create(userData);
        let newUserData = {
           status: (userData.status = "active") ? "inactive" : "active"
        }
        
        // when
        await request(BASE_URL)
            .patch(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(newUserData)
            .expect(STATUS_OK);
        
        // then
        await request(BASE_URL)
            .get(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(STATUS_OK)
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
        await request(BASE_URL)
            .put(`users/NotExisting`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(newUserData)
            .expect(STATUS_NOT_FOUND)
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
        await request(BASE_URL)
            .patch(`users/NotExisting`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(newUserData)
            .expect(STATUS_NOT_FOUND)
            .then(response => {
                expect(response.text).toContain(expectedError);
            });
    });

    test('negative scenario to update with incorrect email',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await newUser.create(userData);
        let newUserData = {
            email: "someStrangeValue"
        };
        // todo
        let expectedError =  "{\"field\":\"email\",\"message\":\"is invalid\"}"
        
        // when
        // then
        await request(BASE_URL)
            .patch(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(newUserData)
            .expect(STATUS_DATA_VALIDATION_FAILED)
            .then(response => {
                expect(response.text).toContain(expectedError);
            });;
    });

    
    test('negative scenario to update with incorrect status',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await newUser.create(userData);
        let newUserData = {
            status: "someStrangeValue"
        };
        // todo
        let expectedError =  "{\"field\":\"status\",\"message\":\"can't be blank\"}"  // error message need to be adjusted after bug is fixed
        
        // when
        // then
        await request(BASE_URL)
            .patch(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(newUserData)
            .expect(STATUS_DATA_VALIDATION_FAILED)
            .then(response => {
                expect(response.text).toContain(expectedError);
            });
    });

    test('negative scenario to update with incorrect gender',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await newUser.create(userData);
        let newUserData = {
            gender: "someStrangeValue"
        };
        // todo
        let expectedError =  "{\"field\":\"gender\",\"message\":\"can't be blank, can be male of female\"}" // need to be changed after bug is fixed
        
        // when
        // then
        await request(BASE_URL)
            .patch(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(newUserData)
            .expect(STATUS_DATA_VALIDATION_FAILED)
            .then(response => {
                expect(response.text).toContain(expectedError);
            });
    });
});

describe('DELETE user', () => {
    test('positive scenario to delete user',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await newUser.create(userData);
        
        // when
        // then
        await request(BASE_URL)
            .delete(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(STATUS_NO_CONTENT);
    });

    test('positive scenario to delete user with external resources',
    async() => {
        // given
        let userData = randomUser.generateRandomData();
        let userId = await newUser.create(userData);
        let postId = await newUser.createPosts(userId);
        await newUser.createTodos(userId);
        await newUser.createComments( userData.name, userData.email, postId);
        
        // when
        // then
        await request(BASE_URL)
            .delete(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(STATUS_NO_CONTENT); 
    });


    test('positive scenario to delete not existing user',
    async() => {
        // given
        let userId = "NotExisting";
        
        // when
        // then
        await request(BASE_URL)
            .delete(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(STATUS_NOT_FOUND);       // should be corrected after defect is fixed
    });
});