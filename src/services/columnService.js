import { columnModel } from "~/models/columnModel"
import { boardModel } from "~/models/boardModel"
import { cardModel } from "~/models/cardModel"
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes"

const getDetails = async (columnId) => {
    try {  
    const column = await columnModel.findOneById(columnId)
    if(!column){
        throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found !')
    }
    return column
    } catch (error) {throw error }

}  
const createdNew = async (reqBody) => {
    try {  
        const newColumn = {
            ...reqBody
           
        }


    const createdColumn = await columnModel.createdNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
    if(getNewColumn) {
        // Xử lý cấu trúc data trước khi trả về dữ liệu
        getNewColumn.cards = []

        // Cập nhật mảng columOrderIds trong collection Boards
        await boardModel.pushColumnOrderIds(getNewColumn)
    }

      return getNewColumn
    } catch (error) {throw error }

}   

const update = async (columnId,reqBody) => {
    try {  
    const updateData= {
        ...reqBody,
        updatedAt: Date.now()
    
    }
    const updatedColumn = await columnModel.update(columnId,updateData)
    

    return updatedColumn
    } catch (error) {throw error }

}  
 
const deleteItem = async (columnId) => {
    try {  
        const targetColumn = await columnModel.findOneById(columnId)
        if(!targetColumn){
            throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found !')
        }
        await columnModel.deleteOneById(columnId)
    
        await cardModel.deleteManyByColumnId(columnId)

        await boardModel.pullColumnOrderIds(targetColumn)
        return { deleteResult: 'Column and its Cards deleted successfully!' }
    } catch (error) {throw error }

} 
export const columnService = {
    createdNew,
    update,
    getDetails,
    deleteItem

}