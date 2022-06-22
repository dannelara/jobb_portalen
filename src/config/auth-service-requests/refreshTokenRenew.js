import fetch from 'node-fetch'

/**
 * Function to fetch a new access_token.
 *
 * @param {object} payLoad  - The data that will be sent to the auth-api.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const renewTokens = async (payLoad) => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payLoad)
    }
    const respons = await fetch(process.env.REFRESH_URL, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
