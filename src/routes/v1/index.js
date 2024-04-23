import express from 'express'
import {StatusCodes} from 'http-status-codes'
import { boardRoute } from './BoardRoute'
import { columnRoute } from './ColumnRoute'
import { cardRoute } from './CardRoute'

const Router = express.Router()

// Check APIs v1/status
Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

// Boards APIs
Router.use('/Boards', boardRoute)

// Column APIs
Router.use('/Columns', columnRoute)

// Card APIs
Router.use('/Cards', cardRoute)

export const APIs_V1 = Router