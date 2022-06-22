import fetch from 'node-fetch'

/**
 * Function to send login data to the auth-service api in order to login to the application.
 *
 * @param {object} payLoad  - The data that will be sent to the auth-api.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const saveImage = async (payLoad) => {
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
    const respons = await fetch(process.env.IMAGE_URL, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
