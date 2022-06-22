/**
 * site controller.
 *
 * @author Daniel Martinez Lara
 * @version 1.0.0
 */

/**
 * Class to handle requests to the site.
 */
export class SiteController {
  /**
   * Method to authorize if the user is authorized to get the requested files.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   *@returns {Error} - The error to show if the user is not autorized to request the requested files.
   */
  async autorize (req, res, next) {
    try {
      if (!req.session.accountData) {
        const error = new Error('Not found')
        error.status = 404
        return next(error)
      }
      next()
    } catch (error) {
      res.redirect(' /')
    }
  }

  /**
   * Method to serve the index page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      res.render('siteViews/index', { accountData: req.accountData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to serve the login page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async loginPageStudent (req, res, next) {
    res.render('siteViews/login-student')
  }

  /**
   * Method to serve the login page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async loginPageEmployer (req, res, next) {
    try {
      res.render('siteViews/login-employer')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to serve register page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async registerPageUser (req, res, next) {
    try {
      res.render('siteViews/register-student')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to serve register page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async registerPageEmployer (req, res, next) {
    try {
      res.render('siteViews/register-employer')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to serve contact page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async contact (req, res, next) {
    try {
      res.render('siteViews/contact', { accountData: req.accountData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to serve about page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async about (req, res, next) {
    try {
      res.render('siteViews/about', { accountData: req.accountData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to serve account page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async account (req, res, next) {
    try {
      if (req.accountData.experiences) {
        req.accountData.experiences = req.accountData.account.experiences.forEach((item) => {
          item.description.split('.')
        })
      }

      res.render('siteViews/account', { accountData: req.accountData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to serve create new post page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createPage (req, res, next) {
    try {
      if (req.accountData.account && req.accountData.account.permissionLevel === 2) {
        res.render('post-views/create-new-post', { accountData: req.accountData })
      } else {
        req.session.flash = { type: 'success', text: 'You do not have permission to create new job posts.' }
        res.redirect('/')
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to log the user out. This will delete the users current session cookie.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    try {
      res.clearCookie('ac2ser')
      res.redirect('/')
    } catch (error) {
      next(error)
    }
  }
}
