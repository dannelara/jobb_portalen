import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const PUBLIC_KEY = process.env.PUBLIC_KEY

/**
 * Method to get the login token from the accessToken.
 *
 * @param {string} tokenObject - The token sent from the auth api.
 * @returns {string} - The replaced string.
 */
export const getToken = async (tokenObject) => {
  try {
    const veryifyOptions = {
      algorithms: ['RS256']
    }
    const token = tokenObject.access_token
    const payload = jwt.verify(token, PUBLIC_KEY, veryifyOptions)
    const accountData = {
      token: token,
      account: payload
    }
    return accountData
  } catch (err) {
    console.log(err)
  }
}
