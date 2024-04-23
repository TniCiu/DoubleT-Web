import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async (req, res, next) => {
    try {     
        const createColumn = await columnService.createdNew(req.body)

        res.status(StatusCodes.CREATED).json(createColumn)
        
    } catch (error) { next(error) }

}



export const columnController = {
    createNew,
}