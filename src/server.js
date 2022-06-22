/**
 * The starting point of the application.
 *
 * @author Daniel Martinez lara
 * @version 1.0.0
 */

import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import logger from 'morgan'
import hbs from 'express-hbs'
import helmet from 'helmet'
import session from 'express-session'
import { router } from './routes/router.js'
// Get the full path to this module path.
const fullPath = dirname(fileURLToPath(import.meta.url))

dotenv.config()

/**
 * The main function of the application.
 */
const main = async () => {
  // The base URL for runing the application on localhost or server.
  const baseURL = process.env.BASE_URL || '/'

  // Create an Express application.
  const app = express()

  // Setting varius HTTP headers to make the application more secure.
  // Since I will be using external links I need to specify them so that they are trusted. "'cdnjs.cloudflare.com'".
  app.use(helmet())
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'default-src': ['*', 'data', 'blob', 'self'],
        'script-src': ["'self'", 'cdnjs.cloudflare.com'],
        'img-src': ['self', '*', 'data:', 'blob', 'http://localhost:5002/api/v1/images/']
      }
    })
  )

  // Setting upp a looger to check for requests. (DEV only)
  app.use(logger('dev'))
  app.use(express.urlencoded({ limit: '5mb', extended: false }))
  app.use(express.json({ limit: '3000kb' }))

  hbs.registerHelper('checkPermission', function (permisssionLevel) {
    let hasPermission = false
    if (permisssionLevel === 2) {
      hasPermission = true
    }
    return hasPermission
  })
  // View engine setup.
  app.engine('hbs', hbs.express4({
    defaultLayout: join(fullPath, 'views', 'layouts', 'default'),
    partialsDir: join(fullPath, 'views', 'partials'),
    helpers: {
      /**
       * Helper to check for permission level.
       *
       * @param {number} permisssionLevel - The account permission level.
       * @returns {boolean} - if the account has permission.
       */
      checkPermission (permisssionLevel) {
        let hasPermission = false
        if (permisssionLevel === 2) {
          hasPermission = true
        }
        return hasPermission
      }
    }
  }))

  app.set('view engine', 'hbs')
  app.set('views', join(fullPath, 'views'))

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).

  app.use(express.urlencoded({ extended: false }))
  // The application will serve these statics file when requesting the site.
  app.use(express.static(join(fullPath, '..', 'public')))

  //  Session configurating.
  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 20,
      sameSite: 'lax'
    }
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie.secure = true // serve secure cookies
  }
  app.use(session(sessionOptions))

  // Hadles flash messeges.
  app.use((req, res, next) => {
    // Flash messages - survives only a round trip.
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    // Pass the base URL to the views.
    res.locals.baseURL = baseURL

    next()
  })

  // Register routes.
  app.use('/', router)
  app.use(function (err, req, res, next) {
    // 404 Not Found.
    if (err.status === 404) {
      return res
        .status(404)
        .sendFile(join(fullPath, 'views', 'errors', '404.html'))
    }

    // 500 Internal Server Error (in production, all other errors send this response).
    if (req.app.get('env') !== 'development') {
      return res
        .status(500)
        .sendFile(join(fullPath, 'views', 'errors', '500.html'))
    }

    // Development only!
    // Only providing detailed error in development.

    // Render the error page.
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })
  })

  app.listen(process.env.port, () => {
    console.log(`Server running at http://localhost:${process.env.port}`)
    console.log('Press Ctrl-C to terminate...')
  })
}
main().catch(console.error)
