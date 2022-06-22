import fetch from 'node-fetch'

/**
 * Function to send a get request to the resource-service api in order to fetch single post.
 *
 * @param {object} id  - The id of the user to update.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const getSingelPost = async (id) => {
  try {
    const requestOptions = {
      method: 'get',
      headers: {
        'PRIVATE-TOKEN': process.env.TOKEN,
        Accept: 'application/json',
        'content-type': 'application/json'
      }
    }
    const respons = await fetch(process.env.RESOURCE_SERVICE + `/${id}`, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
