/**
 * chats controller.
 *
 * @author Daniel Martinez Lara
 * @version 1.0.0
 */
import { getConversation } from '../config/resource-service-requests/fetchConversation.js'
import { sendMessage } from '../config/resource-service-requests/sendMessage.js'
import { getAllChats } from '../config/resource-service-requests/fetchAllAuthorizedChats.js'
import { getPublicData } from '../config/auth-service-requests/getPublicUserData.js'
import { getPublicDataEmployer } from '../config/auth-service-requests/getPublicDataCompany.js'
import { filter } from '../config/misc/filterInput.js'
import { deleteConversation } from '../config/resource-service-requests/deleteConversationPost.js'
import createError from 'http-errors'
/**
 *
 */
export class ConversationsController {
  /**
   * Method to send a delete request to the resource service and delete a specifik coversation.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteConversation (req, res, next) {
    try {
      // Conversation id.
      const conversationToDeleteId = req.params.id
      const respons = await deleteConversation(conversationToDeleteId)
      if (respons.status === 204) {
        // Render messages.
        if (req.accountData.account.permissionLevel === 2) {
          res.redirect(`${res.locals.baseURL}my-messages-company`)
        } else {
          res.redirect(`${res.locals.baseURL}my-messages-user`)
        }
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to get the authorized posts of an user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllAuthorizedConversationsUser (req, res, next) {
    try {
      // Account id
      const id = req.accountData.account.id
      // Fetch authorized conversations.
      const chatsRepons = await getAllChats(id)
      if (chatsRepons.status === 200) {
        const chats = await chatsRepons.json()
        const companyData = []
        // Fetch company datas.
        for (let i = 0; i < chats.length; i++) {
          const CompanyDataRespons = await getPublicDataEmployer(chats[i].owner, req.accountData.token)
          const data = await CompanyDataRespons.json()
          data.profile.chatId = chats[i].id
          companyData.push(data.profile)
        }
        res.render('userViews/all-messages', { accountData: req.accountData, chats: companyData })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to get the authorized posts of an company.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllAuthorizedConversationsCompany (req, res, next) {
    try {
      // Account ID.
      const id = req.accountData.account.id
      const chatsRepons = await getAllChats(id)
      if (chatsRepons.status === 200) {
        const chats = await chatsRepons.json()
        const applicantData = []
        // Get public data of the applicant.
        for (let i = 0; i < chats.length; i++) {
          const userDataRespons = await getPublicData(chats[i].participant, req.accountData.token)
          const data = await userDataRespons.json()
          data.profile.chatId = chats[i].id
          applicantData.push(data.profile)
        }
        res.render('userViews/all-messages', { accountData: req.accountData, chats: applicantData })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to send a request to the resource service to add the new message to the conversation.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async sendMessage (req, res, next) {
    try {
      // Validate that the message content is not empty.
      if (req.body.message.length > 0) {
        // Validate and filter content.
        if (filter(req.body.message)) {
          // Save previus URL in order to redirect the client to that page after the message is sent.
          const prevUrl = req._parsedOriginalUrl.query.split('/private-chat/')[1]
          // Owner of the covnersation.
          const owner = req.accountData.account.id
          // If of the conversation.
          const id = req.params.id

          // Payload
          const payLoad = {
            message: {
              message: req.body.message,
              owner: owner
            }
          }
          // Send request.
          const messageRespons = await sendMessage(payLoad, id)
          if (messageRespons.status === 201) {
            // If the mesage was successfully added to the conversation redirect to the converastion.
            req.session.flash = { type: 'success', text: 'Message sent.' }
            res.redirect(`/private-chat/${prevUrl}`)
          } else {
            req.session.flash = { type: 'error', text: 'Something went wrong. Conversation might have been deleted by the company/user' }
            res.redirect('/account`')
          }
        } else {
          // If the input contains dangerous words, render a validation error message.
          req.session.flash = { type: 'error', text: 'Forbidden characters. This is your first warning. You get 3 warnings, after that, your account will be deleted.' }
          const prevUrl = req._parsedOriginalUrl.query.split('/private-chat/')[1]
          res.redirect(`/private-chat/${prevUrl}`)
        }
      } else {
        // If input is empty, render error massage.
        req.session.flash = { type: 'error', text: 'Message field cannot be left empty. Message was not sent.' }
        const prevUrl = req._parsedOriginalUrl.query.split('/private-chat/')[1]
        res.redirect(`/private-chat/${prevUrl}`)
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method to open a specifik conversation.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async openConversation (req, res, next) {
    try {
      let postOwner
      let participant
      // In order to search for the conversation we need to check if the account type is of company or user account.
      // If account type is of company, the owner will be the current account else the owner will be the query string id.
      if (req.accountData.account.permissionLevel === 2) {
        postOwner = req.accountData.account.id
        participant = req._parsedOriginalUrl.query.split('=')[1]
      } else {
        postOwner = req._parsedOriginalUrl.query.split('=')[1]
        participant = req.accountData.account.id
      }
      // Payload.
      const payLoad = {
        owner: postOwner,
        participant: participant
      }
      const respons = await getConversation(payLoad)
      if (respons.status === 200) {
        const chat = await respons.json()
        let participantRespons
        if (req.accountData.account.permissionLevel === 2) {
          // Check account type. If account is company type the participant will the be applicant.
          // Else the participant will be the company.
          participantRespons = await getPublicData(participant, req.accountData.token)
        } else {
          participantRespons = await getPublicDataEmployer(postOwner, req.accountData.token)
        }
        const participantInfo = await participantRespons.json()
        if (postOwner === chat.owner || postOwner === chat.participant) {
          // Check if the authenticated account owns the messages in order to render the messages differently.
          chat.messages.forEach((message) => {
            if (message.owner === req.accountData.account.id) {
              message.own = true
            }
          })
          res.render('userViews/messages', { accountData: req.accountData, chat: chat, participantInfo: participantInfo.profile })
        } else {
          next(createError(404))
        }
      }
    } catch (error) {
      next(error)
    }
  }
}
