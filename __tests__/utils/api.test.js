import nock from 'nock'
import * as api from '../../client/utils/api'

const host = 'http://localhost:3000'

const testUser = {
  _id: 'foo',
  username: 'bar',
  token: 'baz'
}

afterEach(() => {
  localStorage.clear()
})

//////////////////////////////// START HERE
/* The purpose of this prompt is to get familiarized with mocking parts of 
 * our application that is a dependency of the function we are testing.
 *
 * It is important that we isolate the functionality we are testing by
 * making sure its dependencies run predictably.
 * 
 * If you look at the source of the login function under `client/utils/api.js`
 * you will see that the login function does the following:
 *    a. Make a post request to the login endpoint.
 *    b. Extract the data from the response object.
 *    c. Save the user object to the local storage under the key `user`
 *    d. Returns the whole promise object allowing the caller to catch errors.
 *
 *
 * To pass the prompt:
 *
 * Simulate successful login
 *
 * 1. Create a testUser object with _id, username and token attributes.
 * 2. nock is a testing utility library that will allow you to dictate 
 *    how the endpoint responses should behave. Mock the response and store
 *    it into loginEndpoint variable.
 *    For more info read: https://github.com/node-nock/nock#use
 * 3. invoke the login function from api.js and assert the following:
 *    a. loginEndpoint has been called.
 *    b. expect the resolved value of logged function to equal testUser.
 *    c. get the item from the local storage and expect its value to testUser.
 * 
 * Simulate failed login
 * 
 * Assert the following:
 * 1. loginEndpoint has been called.
 * 2. Error should be defined on catch block.
 * 3. `user` key in localStorage should not be defined.
 */

test('simulate successful login', () => {
  // Mock response to http://localhost:3000/api/login
  let loginEndpoint = nock(host)
    .post('/api/login')
    .reply(200, testUser)

  // 1. assert that a request to the server is made
  // 2. assert that login function resolves to testUser
  // 3. assert that user saved in the localStorage is the same as testUser
  api.login(testUser).then((user) => {
    loginEndpoint.done() // (1.✓) Server is made!
    expect(user).toEqual(testUser) // (2.✓) Resolve value is equal to testUser
    expect(localStorage.getItem('user')).toEqual(JSON.stringify(testUser)) // (3.✓) user is saved to localStorage
  })
})

test('simulate failed login', () => {
  let loginEndpoint = nock(host)
    .post('/api/login')
    .reply(400)

  api.login(testUser).catch((err) => {
    loginEndpoint.done()
    expect(err).toBeDefined()
    expect(localStorage.getItem('user')).not.toBeDefined()  
  })
})

test('simulate register function', () => {
  // Mock response to http://localhost:3000/api/register
  let registerEndpoint = nock(host)
    .post('/api/register')
    .reply(200, testUser)

  // 1. assert that a request to the server is made
  // 2. assert that register function resolves to testUser
  // 3. assert that user saved in the localStorage is the same as testUser
  api.register(testUser).then((newUser) => {
    registerEndpoint.done()
    expect(newUser).toEqual(testUser)
    expect(localStorage.getItem('user')).toEqual(JSON.stringify(testUser))
  })
})

