import fetch from 'node-fetch'

/**
 * Function to fetch filtered posts.
 *
 * @param {object} payLoad  - The data that will be sent to the auth-api.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const fetchFilteredPosts = async (payLoad) => {
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
    const respons = await fetch(process.env.RESOURCE_SERVICE + '/filter', requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
