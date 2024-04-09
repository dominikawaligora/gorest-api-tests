README file
# run #
npm test

# libraries #
supertest, jest - to test the endpoints
faker - to generate fake user data

# defects and problems found #
1. Comments endpoint is returning 404
2. Error message regarding status when creating user is not consistent with others messages 
3. Misspealing in error message regarding missing/invalid gender when creating a new user
4. When sending POST request with incorrect value for gender, the error message contains also information of missing value for status 
5. Error message is not correct when gender or status are set to incorrect value during POST request
6. PUT method should not allow to do partial update
7. When trying to delete not existing user, the error message should not state 404 NOT FOUND