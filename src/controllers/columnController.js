import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const getDetails = async (req, res, next) => {
    try {
        // console.log('req.params:',req.params)
        const columnId = req.params.id

        const column = await columnService.getDetails(columnId)

        // Có kết quả thì trả về phía Client 
        res.status(StatusCodes.OK).json(column)
        
    } catch (error) { next(error) }

}
const createNew = async (req, res, next) => {
    try {     
        const createColumn = await columnService.createdNew(req.body)

        res.status(StatusCodes.CREATED).json(createColumn)
        
    } catch (error) { next(error) }

}

const update = async (req, res, next) => {
    try {
        const columnId = req.params.id

        const updateColumn = await columnService.update(columnId,req.body)

        // Có kết quả thì trả về phía Client 
        res.status(StatusCodes.OK).json(updateColumn)
    } catch (error) { next(error) }

}

const deleteItem = async (req, res, next) => {
    try {
        const columnId = req.params.id

        const result = await columnService.deleteItem(columnId)

        // Có kết quả thì trả về phía Client 
        res.status(StatusCodes.OK).json(result)
    } catch (error) { next(error) }

}

export const columnController = {
    getDetails,
    createNew,
    update,
    deleteItem
}