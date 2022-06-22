
import fetch from 'node-fetch'

/**
 * Function to send a post request to the resource-service api in order to add an applicant to the list.
 *
 * @param {object} id  - The id of the user to update.
 * @param {object} payLoad  - The id of the user to update.
 * @returns {object} - If the user is found the user data will be returned.
 */
export const addApplicant = async (id, payLoad) => {
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

    const respons = await fetch(process.env.RESOURCE_SERVICE + `/applicants/${id}`, requestOptions)
    return respons
  } catch (error) {
    console.log(error)
  }
}
