import fetch from 'node-fetch'

/**
 * Function to send a delete request to the auth-service api in order to delete user experience.
 *
 * @param {object} id  - The id of the user to update.
 * @param {object} token  - The user jwt token to authorize  the request.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const deleteEducationPost = async (id, token) => {
  try {
    const requestOptions = {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'content-type': 'application/json'
      }
    }
    const respons = await fetch(process.env.AUTH_SERVICE_USER + `/delete/education/${id}`, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
