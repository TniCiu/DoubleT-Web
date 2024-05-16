import express from 'express'
import {StatusCodes} from 'http-status-codes'
import { boardRoute } from './BoardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'
import { userRoute } from './userRoute'
import { invitationRoute } from './invitationRoute'

const Router = express.Router()

// Check APIs v1/status
Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

Router.use('/Invitation', invitationRoute)

Router.use('/Users', userRoute)

// Boards APIs
Router.use('/Boards', boardRoute)

// Column APIs
Router.use('/Columns', columnRoute)

// Card APIs
Router.use('/Cards', cardRoute)

export const APIs_V1 = Router