import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()

Router.route('/')
    .post(cardValidation.createNew, cardController.createNew)
    
Router.route('/:id')
    .put(cardController.update)

Router.route('/:cardId/members')
    .post(cardValidation.addMember, cardController.addMemberToCard)

export const cardRoute = Router
