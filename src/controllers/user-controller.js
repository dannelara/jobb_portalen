/**
 * User controller.
 *
 * @author Daniel Martinez Lara
 * @version 1.0.0
 */
import { sendNewEducation } from '../config/auth-service-requests/addNewEducationPost.js'
import { deleteEducationPost } from '../config/auth-service-requests/deleteEducationPost.js'
import createError from 'http-errors'
/**
 *
 */
export class UserController {
  /**
   * Method render the add new education page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addNewEducationView (req, res, next) {
    try {
      if (req.accountData.account && !req.accountData.account.permissionLevel) {
        res.render('userViews/add-new-education', { accountData: req.accountData })
      } else {
        req.session.flash = { type: 'success', text: 'You are a company and cannot add expereinces.' }
        res.redirect('/')
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to make a post request to the auth-serice with the new education to add to the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addNewEducation (req, res, next) {
    try {
      // Get account token
      const token = req.accountData.token

      const start = req.body.start
      const end = req.body.end
      const date = `${start} - ${end}`
      // Payload that will be sent to the api.
      const payLoad = {
        newEducation: {
          name: req.body.name,
          degree: req.body.degree,
          years: date,
          description: req.body.description
        }
      }
      // Send the request with the payLoad and token.
      const respons = await sendNewEducation(payLoad, token)
      if (respons.status === 200) {
        // If everyting goes right render a validation message.
        const answer = await respons.json()
        req.accountData.account.educations = answer.updatedEducations
        req.session.flash = { type: 'success', text: 'Education added!' }
        res.redirect(`${res.locals.baseURL}account`)
      } else {
        next(createError(404))
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to make a post request to the auth-serice with the new education to delete from the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteEducation (req, res, next) {
    try {
      // Account token
      const token = req.accountData.token
      // The id of the education to be deleted.
      const experienceId = req.params.id
      // Send delete request to the auth-api.
      const deleteRespons = await deleteEducationPost(experienceId, token)
      if (deleteRespons.status === 200) {
        // If everything goes right. Update the current educations with the fresh ones.
        const answer = await deleteRespons.json()
        req.accountData.account.educations = answer.updatedEducations
        req.session.flash = { type: 'success', text: 'Education removed!' }
        res.redirect(`${res.locals.baseURL}account`)
      } else {
        req.session.flash = { type: 'success', text: 'Something went wrong! Try again!' }
        res.redirect('/')
      }
    } catch (error) {
      next(error)
    }
  }
}
