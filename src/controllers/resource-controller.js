
/**
 * Snippet controller.
 *
 * @author Daniel Martinez Lara
 * @version 1.0.0
 */

import { deleteExpereince } from '../config/auth-service-requests/Delete-experience.js'
import { sendNewExperience } from '../config/auth-service-requests/newExperiencePost.js'
import createError from 'http-errors'
/**
 *
 */
export class ResourceController {
  /**
   * Method render the add new skill page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addNewSkillView (req, res, next) {
    try {
      // Check if the account is of company type, if yes, redirect and render validation error.
      if (req.accountData.account && !req.accountData.account.permissionLevel) {
        res.render('siteViews/add-new-experience', { accountData: req.accountData })
      } else {
        req.session.flash = { type: 'success', text: 'You are a company and cannot add expereinces.' }
        res.redirect('/')
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to add new job experience to the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addNewSkill (req, res, next) {
    try {
      // Account token
      const token = req.accountData.token
      // Dates the user has entered.
      let start
      let end
      let date
      if (req.body.current === 'on') {
        date = 'Current job'
      } else {
        start = `${req.body.start.split('-')[0]}/${req.body.start.split('-')[1]}`
        end = `${req.body.end.split('-')[0]}/${req.body.end.split('-')[1]}`
        date = `${start} - ${end}`
      }

      // The payLoad with the skill data.
      const payLoad = {
        newExpereience: {
          name: req.body.name,
          title: req.body.title,
          years: date,
          description: req.body.description
        }
      }
      // Send request.
      const respons = await sendNewExperience(payLoad, token)
      if (respons.status === 200) {
        // Updated current experiences with the recived updated experiences.
        const answer = await respons.json()
        req.accountData.account.experiences = answer.updatedExperiences
        req.session.flash = { type: 'success', text: 'Experience added!' }
        res.redirect(`${res.locals.baseURL}account`)
      } else {
        next(createError(404))
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to send a delete request to the auth-service to delete a user experience.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteExpereince (req, res, next) {
    try {
      // Account token
      const token = req.accountData.token
      // Id of the experience to delete.
      const experienceId = req.params.id
      // Send delete experience.
      const deleteRespons = await deleteExpereince(experienceId, token)
      if (deleteRespons.status === 200) {
        // Update current experiences with the recived ones.
        const answer = await deleteRespons.json()
        req.accountData.account.experiences = answer.updatedExperiences
        req.session.flash = { type: 'success', text: 'Experience removed!' }
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
