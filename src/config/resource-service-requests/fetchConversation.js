import fetch from 'node-fetch'

/**
 * Function to fetch specifik conversation from the resource-service.
 *
 * @param {object} payLoad  - The data that will be sent to the resource-api.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const getConversation = async (payLoad) => {
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
    const respons = await fetch(process.env.CHAT_URL, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
