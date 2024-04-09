README file
# run #
npm test

# libraries #
supertest, jest - to test the endpoints
faker - to generate fake user data

# defects and problems found #
1. Error message regarding status when creating user is not consistent with others messages 
2. Misspealing in error message regarding missing/invalid gender when creating a new user
3. When sending POST request with incorrect value for gender, the error message contains also information of missing value for status 
4. Error message is not correct when gender or status are set to incorrect value during POST request
5. PUT method should not allow to do partial update
6. When trying to delete not existing user, the error message should not state 404 NOT FOUND