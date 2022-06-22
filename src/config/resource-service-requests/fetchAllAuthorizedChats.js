import fetch from 'node-fetch'

/**
 * Function to fetch all authorized chats from the resource-service.
 *
 * @param {object} id  - The id of the owner/participant.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const getAllChats = async (id) => {
  try {
    const requestOptions = {
      method: 'get',
      headers: {
        'PRIVATE-TOKEN': process.env.TOKEN,
        Accept: 'application/json',
        'content-type': 'application/json'
      }
    }
    const respons = await fetch(process.env.CHAT_URL + `/${id}`, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
