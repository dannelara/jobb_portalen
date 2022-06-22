import fetch from 'node-fetch'

/**
 * Function to add a new education to a users account.
 *
 * @param {object} payLoad  - The data that will be sent to the auth-api.
 * @param {object} token  - The token that will be sent to the auth-api.
the request.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const sendNewEducation = async (payLoad, token) => {
  try {
    const requestOptions = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payLoad)
    }
    const respons = await fetch(process.env.AUTH_SERVICE_USER + '/education', requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
