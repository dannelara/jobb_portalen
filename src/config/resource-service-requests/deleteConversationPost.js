import fetch from 'node-fetch'

/**
 * Delete a conversation from the resource-service.
 *
 * @param {object} id  - The id that will be sent to the resource-api.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const deleteConversation = async (id) => {
  try {
    const requestOptions = {
      method: 'delete',
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
