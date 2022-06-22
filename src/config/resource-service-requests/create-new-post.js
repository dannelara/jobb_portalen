import fetch from 'node-fetch'

/**
 * Function to new post data to the resource-service api in order to create a new post.
 *
 * @param {object} payLoad  - The data that will be sent to the resource-api.
 * @param {object} method  - The method used to contact the resource-api with.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const createNewPost = async (payLoad, method) => {
  const requestOptions = {
    method: method,
    headers: {
      'PRIVATE-TOKEN': process.env.TOKEN,
      Accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify(payLoad)
  }
  const respons = await fetch(process.env.RESOURCE_SERVICE, requestOptions)
  return respons
}
