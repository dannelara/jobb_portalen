import fetch from 'node-fetch'

/**
 * Function to fetch all posts from the resource-service.
 *
 * @param {object} payLoad  - The data that will be sent to the resource-api.
 * @param {object} method  - The method used to contact the resource-api with.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const getPosts = async (payLoad, method) => {
  try {
    const requestOptions = {
      method: method,
      headers: {
        'PRIVATE-TOKEN': process.env.TOKEN,
        Accept: 'application/json',
        'content-type': 'application/json'
      }
    }
    const respons = await fetch(process.env.RESOURCE_SERVICE, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
