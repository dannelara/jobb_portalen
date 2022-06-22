import express from 'express'
import { SiteController } from '../controllers/site-controller.js'
import { PostController } from '../controllers/post-controller.js'
import { AccountController } from '../controllers/accounts-controller.js'
import { UserController } from '../controllers/user-controller.js'
import { checkJwtLife } from '../config/misc/authJWT.js'
import { ResourceController } from '../controllers/resource-controller.js'
import { ConversationsController } from '../controllers/conversations-controller.js'
export const router = express.Router()
// Controllers
const controller = new SiteController()
const postControl = new PostController()
const accController = new AccountController()
const resourceController = new ResourceController()
const userController = new UserController()
const chatController = new ConversationsController()
// Views
router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/about', (req, res, next) => controller.about(req, res, next))
router.get('/student-login', (req, res, next) => controller.loginPageStudent(req, res, next))
router.get('/employer-login', (req, res, next) => controller.loginPageEmployer(req, res, next))
router.get('/register-student', (req, res, next) => controller.registerPageUser(req, res, next))
router.get('/register-employer', (req, res, next) => controller.registerPageEmployer(req, res, next))
router.get('/contact', (req, res, next) => controller.contact(req, res, next))
router.get('/account', controller.autorize, (req, res, next) => controller.account(req, res, next))
router.get('/logout', controller.autorize, (req, res, next) => controller.logout(req, res, next))
router.get('/new', controller.autorize, controller.createPage)

//* Possible user actions
router.post('/login-student', accController.loginUser)
router.post('/login-employer', accController.loginEmployer)
router.post('/register-student', accController.registerStudent)
router.post('/register-employer', accController.registerEmployer)
router.get('/edit-profile', controller.autorize, (req, res, next) => accController.editAccountPage(req, res, next))

// Jobs views
router.get('/jobs', (req, res, next) => postControl.showJobs(req, res, next))
router.get('/jobs/:id', postControl.getSingelPost)
router.post('/jobs/:id', checkJwtLife, controller.autorize, (req, res, next) => postControl.applyToJobPost(req, res, next))
router.post('/jobs/remove-application/:id', controller.autorize, checkJwtLife, (req, res, next) => postControl.removeApplication(req, res, next))
router.post('/new', checkJwtLife, controller.autorize, (req, res, next) => postControl.createNewPost(req, res, next))
router.get('/private-posts', controller.autorize, checkJwtLife, postControl.getPrivatePosts)
router.get('/private-posts/:id', controller.autorize, checkJwtLife, (req, res, next) => postControl.showPrivatePost(req, res, next))
router.get('/applicant/:id', controller.autorize, checkJwtLife, (req, res, next) => postControl.showApplicantProfile(req, res, next))
router.get('/private-posts/delete/:id', controller.autorize, checkJwtLife, (req, res, next) => postControl.deletePost(req, res, next))

// Search option
router.get('/search?', postControl.searchJobs)

// Update accounts
router.post('/edit-profile-user/:id', checkJwtLife, controller.autorize, (req, res, next) => accController.editUser(req, res, next))
router.post('/edit-profile-employer/:id', checkJwtLife, controller.autorize, (req, res, next) => accController.editEmployer(req, res, next))

// Delete account
router.get('/delete-account', checkJwtLife, controller.autorize, (req, res, next) => accController.deleteAccountView(req, res, next))
router.post('/delete-account/:id', checkJwtLife, controller.autorize, (req, res, next) => accController.deleteAccount(req, res, next))

// Routes for user resources like job experiences etc.
router.get('/experience/new', controller.autorize, resourceController.addNewSkillView)
router.post('/experience/new', controller.autorize, checkJwtLife, resourceController.addNewSkill)
router.post('/experience/:id', checkJwtLife, controller.autorize, (req, res, next) => resourceController.deleteExpereince(req, res, next))

// Add new education view.

router.get('/education/new', controller.autorize, (req, res, next) => userController.addNewEducationView(req, res, next))
// Add education
router.post('/education/new', checkJwtLife, checkJwtLife, (req, res, next) => userController.addNewEducation(req, res, next))
router.post('/education/:id', checkJwtLife, controller.autorize, (req, res, next) => userController.deleteEducation(req, res, next))

// Chats.
router.get('/private-chat/', controller.autorize, checkJwtLife, (req, res, next) => chatController.openConversation(req, res, next))
router.post('/private-chat/:id', controller.autorize, checkJwtLife, (req, res, next) => chatController.sendMessage(req, res, next))
router.get('/my-messages-company', controller.autorize, checkJwtLife, (req, res, next) => chatController.getAllAuthorizedConversationsCompany(req, res, next))
router.get('/my-messages-user', controller.autorize, checkJwtLife, (req, res, next) => chatController.getAllAuthorizedConversationsUser(req, res, next))
router.post('/delete-coversation/:id', controller.autorize, checkJwtLife, (req, res, next) => chatController.deleteConversation(req, res, next))
