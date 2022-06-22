import fetch from 'node-fetch'

/**
 * Function to send a message that will be added to a specifik conversation from the resource-service.
 *
 * @param {object} payLoad  - The data that will be sent to the resource-api.
 * @param {object} id  - The id of the chat.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const sendMessage = async (payLoad, id) => {
  try {
    const requestOptions = {
      method: 'post',
      headers: {
        'PRIVATE-TOKEN': process.env.TOKEN,
        Accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payLoad)
    }
    const respons = await fetch(process.env.CHAT_URL + `/${id}`, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
