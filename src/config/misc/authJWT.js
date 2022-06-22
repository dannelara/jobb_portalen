import { renewTokens } from '../auth-service-requests/refreshTokenRenew.js'
import jwt from 'jsonwebtoken'
const PUBLIC_KEY = process.env.PUBLIC_KEY
/**
 * Authenticating the JWT token.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const checkJwtLife = async (req, res, next) => {
  try {
    let token
    if (req.accountData) {
      const veryifyOptions = {
        algorithms: ['RS256']
      }
      token = req.accountData.token
      jwt.verify(token, PUBLIC_KEY, veryifyOptions)
      next()
    }
  } catch (err) {
    if (err.message === 'jwt expired') {
      const tokenOwner = req.accountData.account.id
      const payLoad = {
        userId: tokenOwner
      }

      const respons = await renewTokens(payLoad)
      if (respons.status === 200) {
        const newTokens = await respons.json()
        delete req.accountData.token
        req.accountData.token = newTokens.access_token
      } else {
        res.clearCookie('ac2ser')
        res.redirect('.')
      }
      next()
    }
  }
}
