import fetch from 'node-fetch'

/**
 * Function to send post request to the auth-service api in order to delete an account.
 *
 * @param {object} url  - The url of the user/employer.
 * @param {object} payLoad  - The data that will be sent to the auth-api.
 * @param {object} token  - The user jwt token to authorize  the request.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const deletePostAccount = async (url, payLoad, token) => {
  try {
    const requestOptions = {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payLoad)
    }
    const respons = await fetch(url + '/delete', requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
