import express from 'express'
import createError from 'http-errors'
import { router as v1Router } from './routes-controller.js'

/**
 * Function to authenticate the user, if there is any inside the req.session.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const getAccountData = (req, res, next) => {
  try {
    let accountData
    if (req.session.accountData) {
      accountData = req.session.accountData
      req.accountData = accountData
    }
    next()
  } catch (err) {
    next(createError(404))
  }
}
export const router = express.Router()

router.use('/', getAccountData, v1Router)
router.use('*', (req, res, next) => next(createError(404)))
