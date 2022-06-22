import { getPosts } from '../config/resource-service-requests/fetchPosts.js'
import { addApplicant } from '../config/resource-service-requests/addNewApplicant.js'
import { createNewPost } from '../config/resource-service-requests/create-new-post.js'
import { fetchFilteredPosts } from '../config/resource-service-requests/fetchFilteredPosts.js'
import { getSingelPost } from '../config/resource-service-requests/getSignelPost.js'
import { filter } from '../config/misc/filterInput.js'
import { getPrivatePosts } from '../config/resource-service-requests/getPrivatePosts.js'
import { getPublicData } from '../config/auth-service-requests/getPublicUserData.js'
import { deletePostRequest } from '../config/resource-service-requests/deletePost.js'
import { removeApplicant } from '../config/resource-service-requests/removeJobApplication.js'
import createError from 'http-errors'
/**
 *
 */
export class PostController {
  /**
   * Method to remove user application from a job post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async removeApplication (req, res, next) {
    try {
      // The id of the job post.
      const jobPostId = req.params.id
      // Pay load with the id of the user to remove from the job post.
      const payLoad = {
        id: req.accountData.account.id
      }
      // Send the request.
      const respons = await removeApplicant(jobPostId, payLoad)
      if (respons.status === 204) {
        // If the user is succesfully removed, redirect to the jobs page and render a validation message.
        req.session.flash = { type: 'success', text: 'Application removed!' }
        res.redirect(`${res.locals.baseURL}jobs`)
      } else {
        req.session.flash = { type: 'success', text: 'Something went wrong. Please try again' }
        res.redirect(`${res.locals.baseURL}jobs`)
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to apply to a job post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async applyToJobPost (req, res, next) {
    try {
      // Check if the account type isnt company type, if yes, render error message.
      if (req.accountData.account.permissionLevel !== 2) {
        // Check if the account has updated their profile and can apply. If not render an error message.
        if (req.accountData.account.canApply) {
          // The job id.
          const jobPostId = req.params.id
          // Applicant id.
          const applicantId = req.accountData.account.id
          // Payload with applicant ID.
          const payLoad = {
            applicantId: applicantId
          }
          // Send request.
          const respons = await addApplicant(jobPostId, payLoad)
          if (respons.status === 200) {
            // If everyting goes rigth. Render success message.
            req.session.flash = { type: 'success', text: 'Application successful!' }
            res.redirect(`${res.locals.baseURL}jobs`)
          } else {
            req.session.flash = { type: 'success', text: 'You cannot apply again to this job.' }
            res.redirect(`${res.locals.baseURL}jobs`)
          }
        } else {
          req.session.flash = { type: 'success', text: 'You need to update your profile before you can apply.' }
          res.redirect(`${res.locals.baseURL}account`)
        }
      } else {
        req.session.flash = { type: 'success', text: 'You cannot apply again to this job because you are a company.' }
        res.redirect(`${res.locals.baseURL}account`)
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to show private posts.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getPrivatePosts (req, res, next) {
    try {
      // Check if account type is of company, if yes, render their posts.
      if (req.accountData.account.permissionLevel === 2) {
        const ownerId = req.accountData.account.id
        const respons = await getPrivatePosts(ownerId)
        if (respons.status === 200) {
          const postAnswer = await respons.json()
          res.render('post-views/private-posts', { posts: postAnswer.posts, accountData: req.accountData })
        }
      } else {
        next(createError(404))
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to show specifik private post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async showPrivatePost (req, res, next) {
    try {
      // Get specifik single job post.
      const postRespons = await getSingelPost(req.params.id)
      if (postRespons.status === 200) {
        // If successfull fetch the applicants profile and render them.
        const answer = await postRespons.json()
        if (req.accountData.account.id === answer.post.owner) {
          const applicantData = []
          for (let i = 0; i < answer.post.applicants.length; i++) {
            // Get applicants public profiles.
            const userDataRespons = await getPublicData(answer.post.applicants[i].id, req.accountData.token)
            const data = await userDataRespons.json()
            applicantData.push(data.profile)
          }
          res.render('post-views/show-private-post', { accountData: req.accountData, post: answer.post, applicants: applicantData })
        } else {
          next(createError(404))
        }
      } else {
        next(createError(404))
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to show a single post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getSingelPost (req, res, next) {
    try {
      // Get single job post.
      const postRespons = await getSingelPost(req.params.id)
      if (postRespons.status === 200) {
        const answer = await postRespons.json()
        if (req.accountData) {
          // If user is logged in and check if the user has applied to the job post and render respective remove/aply button.
          for (let i = 0; i < answer.post.applicants.length; i++) {
            if (answer.post.applicants[i].id === req.accountData.account.id) {
              answer.post.applied = true
            } else {
              answer.post.applied = false
            }
          }
        }
        res.render('post-views/single-post', { accountData: req.accountData, post: answer.post })
      } else {
        next(createError(404))
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to  create new post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createNewPost (req, res, next) {
    try {
      // Check that all the data sent is filled in.
      if (req.body.title.length > 0 && req.body.offer.length > 0 && req.body.requirements.length > 0 && req.body.description.length > 0) {
        // Filter and validate content.
        if (filter(req.body.title) && filter(req.body.offer) && filter(req.body.requirements) && filter(req.body.description)) {
          const method = 'POST'
          // Payload with the job post data.
          const payLoad = {
            img: req.accountData.account.img,
            companyName: req.accountData.account.companyName,
            city: req.accountData.account.city,
            title: req.body.title,
            about: req.accountData.account.about,
            offer: req.body.offer,
            requirements: req.body.requirements,
            description: req.body.description,
            owner: req.accountData.account.id
          }
          // Send request.
          const respons = await createNewPost(payLoad, method)
          if (respons.status === 201) {
            // If the job post was created successfully redirect to the landing page and render validation message.
            req.session.flash = { type: 'success', text: 'Job post was created successfully.' }
            res.redirect('/')
          } else {
            req.session.flash = { type: 'success', text: 'Something went wrong.' }
            res.redirect('/')
          }
        } else {
          // If the content containes dangerous words, render validation error message.
          const errMsg = 'Forbbiden characters! Fill in all fields correctly.'
          res.render('post-views/create-new-post', {
            validationErrors: [errMsg],
            account: req.account
          })
        }
      } else {
        // If the content is empty, render validation error.
        const errMsg = 'Make sure all fields are filled in.'
        res.render('post-views/create-new-post', {
          validationErrors: [errMsg],
          account: req.account
        })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to show all job posts.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async showJobs (req, res, next) {
    try {
      const respons = await getPosts()
      if (respons.status === 200) {
        const postsData = await respons.json()
        postsData.posts.forEach((post) => {
          post.description = post.description.split('.')[0]
        })
        res.render('post-views/jobs', { posts: postsData.posts, accountData: req.accountData })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to search for a specifik job post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async searchJobs (req, res, next) {
    try {
      // Get the query string with the search keywords.
      const firstSplit = req._parsedOriginalUrl.query.split('&')

      // The city.
      const city = firstSplit[0].split('=')[1]
      // Keyword.
      const word = firstSplit[1].split('=')[1]
      // Check so that the city isn't left empty somehow.
      if (city.length > 0) {
        // Validate input.
        if (filter(city)) {
          // Payload
          const payLoad = {
            city: city,
            keyword: word
          }
          // Send request.
          const respons = await fetchFilteredPosts(payLoad)
          if (respons.status === 200) {
            // Render filtered-posts page with the content.
            const filteredPosts = await respons.json()
            res.render('post-views/filtered-posts', { posts: filteredPosts })
          } else {
            next(createError(404))
          }
        } else {
          // If input contains dangerous words, render validatio error message.
          req.session.flash = { type: 'success', text: 'Forbbiden characters! Fill in all fields correctly.' }
          res.redirect('/')
        }
      } else {
        // If the city input is somehow left empty. Render validation error message.
        req.session.flash = { type: 'success', text: 'No city entered. Please enter the city name correctly.' }
        res.redirect('/')
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to show applicant profile.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async showApplicantProfile (req, res, next) {
    try {
      // Check if the account is of company type.
      if (req.accountData.account.permissionLevel === 2) {
        // Get the post id.
        const postId = req._parsedOriginalUrl.query.split('=')[1]
        // Fetch the post.
        const fetchPost = await getSingelPost(postId)
        if (fetchPost.status === 200) {
          const post = await fetchPost.json()
          // Check that the current account is the owner of the job post.
          if (post.post.owner === req.accountData.account.id) {
            let exist = false
            // Check that the applicant has applied to the job post.
            post.post.applicants.forEach((applicant) => {
              if (applicant.id === req.params.id) {
                exist = true
              }
            })
            // If the applicant has applied to the job post fetch the public data of the account.
            if (exist) {
              const fetchUser = await getPublicData(req.params.id, req.accountData.token)
              if (fetchUser.status === 200) {
                // Render the public profile of the applicant.
                const profileData = await fetchUser.json()
                res.render('post-views/applicant-profile', { accountData: req.accountData, profileData: profileData.profile })
              } else {
                next(createError(404))
              }
            } else {
              next(createError(404))
            }
          } else {
            next(createError(404))
          }
        } else {
          next(createError(404))
        }
      } else {
        next(createError(404))
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to delete a specifik job post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deletePost (req, res, next) {
    try {
      // Job post id.
      const postId = req.params.id
      // Fetch requested post.
      const fetchPost = await getSingelPost(postId, req.accountData.token)
      if (fetchPost.status === 200) {
        const post = await fetchPost.json()
        // Check if the account is the owner of the requested job post.
        if (post.post.owner === req.accountData.account.id) {
          // Send delete request,
          const deleteRespons = await deletePostRequest(postId)
          if (deleteRespons.status === 204) {
            // If job post is successfully deleted render sucess message.
            req.session.flash = { type: 'success', text: 'Job post was succefully deleted!' }
            res.redirect('/')
          } else {
            req.session.flash = { type: 'success', text: 'Something went wrong, try again!' }
            res.redirect('/')
          }
        } else {
          // If The account isn't the owner of the job post, render a 404 status code.
          next(createError(404))
        }
      } else {
        req.session.flash = { type: 'success', text: 'Something went wrong, try again!' }
        res.redirect('/')
      }
    } catch (error) {
      next(error)
    }
  }
}
