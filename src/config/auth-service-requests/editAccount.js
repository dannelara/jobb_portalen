import fetch from 'node-fetch'

/**
 * Function to send login data to the auth-service api in order to edit an account.
 *
 * @param {object} url  - The url for the specifik route.
 * @param {object} payLoad  - The data that will be sent to the auth-api.
 * @param {object} token  - The user jwt token to authorize  the request.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const editAccountPost = async (url, payLoad, token) => {
  try {
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payLoad)
    }
    const respons = await fetch(url + '/', requestOptions)
    return respons
  } catch (error) {

  }
}
