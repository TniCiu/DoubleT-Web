import { columnModel } from "~/models/columnModel"
import { boardModel } from "~/models/boardModel"

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

   
 

export const columnService = {
    createdNew
}