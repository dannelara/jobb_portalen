import fetch from 'node-fetch'

/**
 * Function to fetch the public data of a user.
 *
 * @param {object} id  - The id of the user to fetch.
 * @param {object} token  - The user jwt token to authorize  the request.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const getPublicData = async (id, token) => {
  try {
    const requestOptions = {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'content-type': 'application/json'
      }
    }
    const respons = await fetch(process.env.AUTH_SERVICE_USER + `/${id}`, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
