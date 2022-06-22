/**
 * Accounts controller.
 *
 * @author Daniel Martinez Lara
 * @version 1.0.0
 */
import { saveImage } from '../config/image-service-requests/newImagePost.js'
import { registerUser } from '../config/auth-service-requests/registerPostUser.js'
import { registerEmp } from '../config/auth-service-requests/registerEmployer.js'
import { loginPostUser } from '../config/auth-service-requests/loginPostUser.js'
import { loginPostEmployer } from '../config/auth-service-requests/loginPostEmployer.js'
import { editAccountPost } from '../config/auth-service-requests/editAccount.js'
import { filter } from '../config/misc/filterInput.js'
import { deletePostAccount } from '../config/auth-service-requests/deleteAccount.js'
import { getToken } from '../config/misc/getLoginToken.js'
import createError from 'http-errors'
/**
 *
 */
export class AccountController {
  /**
   * Method to register and employer-account to the auth service.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async registerEmployer (req, res, next) {
    try {
      const body = req.body
      // Validate input length.
      if (body.name.length > 0 && body.email.length > 0 && body.password.length > 0 && body.country.length > 0 && body.adress.length > 0 && body.city.length > 0) {
        // Validate and filter input.
        if (filter(body.name) && filter(body.country) && filter(body.adress) && filter(body.city) && filter(body.email) && filter(body.password)) {
          // New company account data payLoad.
          const payLoad = {
            companyName: body.name,
            country: body.country,
            adress: body.adress,
            city: body.city,
            email: body.email,
            password: body.password,
            permissionLevel: 2
          }
          // Send register request to the auth-api.
          const account = await registerEmp(payLoad)
          if (account.status === 201) {
            // If successfully created render login page.
            req.session.flash = { type: 'success', text: 'Welcome! You can now login to your account!' }
            res.redirect(`${res.locals.baseURL}employer-login`)
          } else {
          // If account already exists, render error message.
            const errMsg = 'Account aready exists!'
            res.render('siteViews/register-employer', {
              validationErrors: [errMsg]
            })
          }
        } else {
          // If content contains dangerous words, render validation error.
          const errMsg = 'Forbidden characters! Fill in the fields correctly.'
          res.render('siteViews/register-employer', {
            validationErrors: [errMsg]
          })
        }
      } else {
        // If any fields are left empty, render validation error.
        const errMsg = 'You missed to fill in all fields.'
        res.render('siteViews/register-student', {
          validationErrors: [errMsg]
        })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to register and account to the auth service.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async registerStudent (req, res, next) {
    try {
      const body = req.body
      // Validate input length.
      if (body.name.length > 0 && body.lastname.length > 0 && body.email.length > 0 && body.password.length > 0) {
        //  Validate and filter input.
        if (filter(body.name) && filter(body.lastname) && filter(body.title) && filter(body.email) && filter(body.password)) {
          // New user account data.
          const payLoad = {
            name: body.name,
            lastname: body.lastname,
            title: body.title,
            email: body.email,
            password: body.password
          }

          // Send register request to the auth-api.
          const account = await registerUser(payLoad)
          if (account.status === 201) {
            // If register is successfull, redirect to login page.
            req.session.flash = { type: 'success', text: 'Welcome! You can now login to your account!' }
            res.redirect(`${res.locals.baseURL}student-login`)
          } else {
            // If account already exists, render error message.
            const errMsg = 'Email is already in use!'
            res.render('siteViews/register-student', {
              validationErrors: [errMsg]
            })
          }
        } else {
        // If content contains dangerous words, render validation error.
          const errMsg = 'Forbidden characters! Fill in the fields correctly.'
          res.render('siteViews/register-student', {
            validationErrors: [errMsg]
          })
        }
      } else {
        // If any fields are left open, render error message.
        const errMsg = 'You missed to fill in all fields.'
        res.render('siteViews/register-student', {
          validationErrors: [errMsg]
        })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to login to the application.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async loginUser (req, res, next) {
    try {
      const body = req.body
      // Validate length of the input.
      if (body.email.length > 0 && body.password.length > 0) {
        // Filter and validate input.
        if (filter(body.email) && filter(body.password)) {
          // Payload.
          const payLoad = {
            email: body.email,
            password: body.password
          }
          const respons = await loginPostUser(payLoad)
          if (respons.status === 200) {
            const token = await respons.json()
            // Get access token.
            const accountData = await getToken(token)
            // Save token to the session.
            req.session.accountData = accountData
            if (!accountData.account.canApply) {
              // If account is fresh render message that they need to update their profile before aplying to a job post.
              req.session.flash = { type: 'success', text: 'Before you can apply to a job, you need to update your profile.' }
            }
            res.redirect(`${res.locals.baseURL}account`)
          } else {
            // If no user is found, render validation error.
            const errMsg = 'Invalid credentials!'
            res.render('siteViews/login-student', {
              validationErrors: [errMsg]
            })
          }
        } else {
          // If content contains dangerous words, render validation error.
          const errMsg = 'Forbbiden characters! Enter email and password correctly.'
          res.render('siteViews/login-student', {
            validationErrors: [errMsg]
          })
        }
      } else {
        // If any fields are left empty, render error message.
        const errMsg = 'Email or password missing, fill in correctly.'
        res.render('siteViews/login-student', {
          validationErrors: [errMsg]
        })
      }
    } catch (error) {
      const err = createError(404)
      err.innerException = error
      next(err)
    }
  }

  /**
   * Method to login/employer to the application.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async loginEmployer (req, res, next) {
    try {
      const body = req.body
      // Validate content length.
      if (body.email.length > 0 && body.password.length > 0) {
        // Filter and validate content.
        if (filter(body.email) && filter(body.password)) {
          // Payload.
          const payLoad = {
            email: body.email,
            password: body.password
          }
          const respons = await loginPostEmployer(payLoad)
          if (respons.status === 200) {
            // Save access-token.
            const token = await respons.json()
            const accountData = await getToken(token)
            req.session.accountData = accountData
            res.redirect(`${res.locals.baseURL}account`)
          } else {
            // If no user is found, render validation error.
            const errMsg = 'Invalid credentials!'
            res.render('siteViews/login-employer', {
              validationErrors: [errMsg]
            })
          }
        } else {
          // If content contains dangerous words render error message.
          const errMsg = 'Forbbiden characters! Enter email and password correctly.'
          res.render('siteViews/login-employer', {
            validationErrors: [errMsg]
          })
        }
      } else {
        // If any input fields are left empty, render error message.
        const errMsg = 'Email or password missing, fill in correctly.'
        res.render('siteViews/login-student', {
          validationErrors: [errMsg]
        })
      }
    } catch (error) {
      const err = createError(404)
      err.innerException = error
      next(err)
    }
  }

  /**
   * Method to render edit-page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async editAccountPage (req, res, next) {
    try {
      const account = req.accountData
      res.render('siteViews/edit-account', { accountData: account })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to edit a user account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async editUser (req, res, next) {
    try {
      const data = req.body
      // User access token.
      const token = req.accountData.token
      let url
      // Filter and validate content.+
      if (filter(data.name) && filter(data.lastname) && filter(data.about) && filter(data.title) && filter(data.name)) {
        // If user has uploaded a new image get the image base64 data.
        if (data.data.length > 0) {
          const newImageData = {
            data: data.data.split(',')[1],
            contentType: data.data.split(',')[0].split(':')[1].split(';')[0]
          }
          // Send save image reust and save the url to the url variable.
          const respons = await saveImage(newImageData)
          const responsUrl = await respons.json()
          url = responsUrl.url
        }
        // new account data.
        const payLoad = {
          img: url,
          name: data.name,
          lastname: data.lastname,
          about: data.about,
          title: data.title
        }
        // Send put request to the auth-apit.
        const respons = await editAccountPost(process.env.AUTH_SERVICE_USER, payLoad, token)
        // Remove current session cookie and update it with the new.
        res.clearCookie('ac2ser')
        const updatedAccount = await respons.json()
        req.session.accountData.account = updatedAccount.account
        req.session.flash = { type: 'success', text: 'Profile successfully updated.' }
        res.redirect(`${res.locals.baseURL}account`)
      } else {
        // If the content is invalid or dangerous, render error message.
        const errMsg = 'Invalid input!'
        res.render('siteViews/edit-account', {
          validationErrors: [errMsg],
          accountData: req.accountData
        })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to edit a company account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async editEmployer (req, res, next) {
    try {
      const data = req.body
      let url
      // account token.
      const token = req.accountData.token
      // Filter and validate input.
      if (filter(data.name) && filter(data.country) && filter(data.adress) && filter(data.city) && filter(data.about)) {
        // If there's a new image upload get image base64 data and send request to the image service.
        if (data.data.length > 0) {
          const newImageData = {
            data: data.data.split(',')[1],
            contentType: data.data.split(',')[0].split(':')[1].split(';')[0]
          }
          const respons = await saveImage(newImageData)
          const responsUrl = await respons.json()
          url = responsUrl.url
        }
        // New data payLoad.
        const payLoad = {
          img: url,
          companyName: data.name,
          country: data.country,
          adress: data.adress,
          city: data.city,
          about: data.about
        }
        const respons = await editAccountPost(process.env.AUTH_SERVICE_EMPLOYER, payLoad, token)
        // Delete old session cookie and update it with the new accesstoken.
        res.clearCookie('ac2ser')
        const updatedAccount = await respons.json()
        req.session.accountData.account = updatedAccount.account
        req.session.flash = { type: 'success', text: 'Profile successfully updated.' }
        res.redirect(`${res.locals.baseURL}account`)
      } else {
        // If the content is dangerous render error message.
        const errMsg = 'Invalid input!'
        res.render('siteViews/edit-account', {
          validationErrors: [errMsg],
          accountData: req.accountData
        })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to render the delete account view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteAccountView (req, res, next) {
    try {
      res.render('siteViews/delete-account', { accountData: req.accountData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to delete an account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteAccount (req, res, next) {
    try {
      // Filter the input.
      if (filter(req.body.email) && filter(req.body.password)) {
        let authenticateAccount
        // Account ID.
        const accountId = req.params.id
        // payload.
        const loginPayLoad = {
          email: req.body.email,
          password: req.body.password
        }
        // Check the type of the account in order to send the right api call.
        // Authenticate the user before they can delete their account.
        if (req.accountData.account.permissionLevel === 2) {
          const loginRespons = await loginPostEmployer(loginPayLoad)
          const token = await loginRespons.json()
          const data = await getToken(token)
          authenticateAccount = data
        } else {
          const loginRespons = await loginPostUser(loginPayLoad)
          const token = await loginRespons.json()
          const data = await getToken(token)
          authenticateAccount = data
        }

        // If the account is successfully authenticated create new payload and send delete account request.
        if (authenticateAccount) {
          const userFund = authenticateAccount.account
          if (accountId === userFund.id) {
            let url
            const payLoad = {
              email: userFund.email,
              password: req.body.password
            }
            if (userFund.permissionLevel === 2) {
              url = process.env.AUTH_SERVICE_EMPLOYER
            } else {
              url = process.env.AUTH_SERVICE_USER
            }
            const deleteRespons = await deletePostAccount(url, payLoad, authenticateAccount.token)
            if (deleteRespons.status === 204) {
              // Delete the session cookie and redirect to the landing page.
              res.clearCookie('ac2ser')
              res.redirect('/')
              return
            }
          } else {
            next(createError(404))
          }
        } else {
          // If the user is not authenticated render invalid credentials error message.
          const errMsg = 'Invalid credentials!'
          res.render('siteViews/delete-account', {
            validationErrors: [errMsg],
            accountData: req.accountData
          })
        }
      } else {
        // If the input contains dangerous words, render validation error message.
        const errMsg = 'Invalid Input!'
        res.render('siteViews/delete-account', {
          validationErrors: [errMsg],
          accountData: req.accountData
        })
      }
    } catch (error) {
      next(error)
    }
  }
}
