import chai from 'chai'
import { loginPost } from '../src/config/loginPostUser.js'
import { loginPostEmployer } from '../src/config/loginPostEmployer.js'
const expect = chai.expect

describe('Check login for users', () => {
  it('Login with correct credentains returns 200 status code.', async () => {
    const payLoad = {
      email: '11daniel@live.se',
      password: 'correctPassword'
    }
    const result = await loginPost(payLoad)
    expect(result.status).to.equal(200)
  })
  it('Login with wrong credentails returns 404 status code.', async () => {
    const payLoad = {
      email: 'wrognEmail@live.se',
      password: 'wrongPassowrd'
    }
    const result = await loginPost(payLoad)
    expect(result.status).to.equal(404)
  })
})

describe('Check login employers', () => {
  it('Login with correct credentains returns 200 status code.', async () => {
    const payLoad = {
      email: '11daniel@live.se',
      password: 'correctPassword'
    }
    const result = await loginPostEmployer(payLoad)
    expect(result.status).to.equal(200)
  })
  it('Login with wrong credentails returns 404 status code.', async () => {
    const payLoad = {
      email: 'wrognEmail@live.se',
      password: 'wrongPassowrd'
    }
    const result = await loginPostEmployer(payLoad)
    expect(result.status).to.equal(404)
  })
})
