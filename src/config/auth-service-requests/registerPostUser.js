import fetch from 'node-fetch'

/**
 * Function to send registration data to the auth-service api.
 *
 * @param {object} payLoad  - The data that will be sent to the auth-api.
 * @returns {object} - The user created.
 */
export const registerUser = async (payLoad) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'PRIVATE-TOKEN': process.env.TOKEN,
      Accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify(payLoad)
  }
  const respons = await fetch(process.env.AUTH_SERVICE_USER + '/register', requestOptions)

  return respons
}
