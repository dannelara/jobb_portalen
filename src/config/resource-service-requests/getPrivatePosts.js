import fetch from 'node-fetch'

/**
 * Function to send a get request to the resource-service api in order to fetch private post.
 *
 * @param {object} id  - The id of the post owner.
 * @returns {object} - If the user have posts the data will be returned with their private posts.
 */
export const getPrivatePosts = async (id) => {
  try {
    const requestOptions = {
      method: 'get',
      headers: {
        'PRIVATE-TOKEN': process.env.TOKEN,
        Accept: 'application/json',
        'content-type': 'application/json'
      }
    }
    const respons = await fetch(process.env.RESOURCE_SERVICE + `/private-posts/${id}`, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
