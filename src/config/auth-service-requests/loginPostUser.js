import fetch from 'node-fetch'

/**
 * Function to send login data to the auth-service api in order to login to the application.
 *
 * @param {object} payLoad  - The data that will be sent to the auth-api.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const loginPostUser = async (payLoad) => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'PRIVATE-TOKEN': process.env.TOKEN,
        Accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payLoad)
    }
    const respons = await fetch(process.env.AUTH_SERVICE_USER + '/login', requestOptions)
    return respons
  } catch (error) {

  }
}
