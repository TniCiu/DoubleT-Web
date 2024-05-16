import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'


const Router = express.Router()

Router.route('/')
    .get(boardController.getAll)
    .post(boardValidation.createNew, boardController.createNew)

Router.route('/Users/:ownerIds')
    .get(boardController.getUserBoards)
    
Router.route('/:id/members')
    .get(boardController.getBoardMembersInfo);

Router.route('/:id')
    .get(boardController.getDetails)
    .put(boardValidation.update,boardController.update)
    .delete(boardValidation.deleteBoard,boardController.deleteBoard)

//API hỗ trợ cho việc di chuyển card giữa các column khác nhau trong 1 board
Router.route('/supports/moving_cards')
    .put(boardValidation.moveCardToDifferentColumn,boardController.moveCardToDifferentColumn)
export const boardRoute = Router