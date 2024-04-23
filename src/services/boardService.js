import { slugify } from "~/utils/formatters"
import { boardModel } from "~/models/boardModel"
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes"
import { cloneDeep } from "lodash"
import { columnModel } from "~/models/columnModel"


const createdNew = async (reqBody) => {
    try {  
    // Làm thêm các xử lý logic tùy đặc thủ đồ án 
    
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
            // title:'test gắn mặc dịnh val'
        }


    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database 
    const createdBoard = await boardModel.createdNew(newBoard)
    // console.log(createdBoard)

    // Lấy bản ghi board sau khi gọi 
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // console.log(getNewBoard)
    // Làm thêm các xử lý logic với các Collection khác tùy đặc thủ đồ án  
    // Notification về cho admin khi có 1 cái Board mới được tạo 


    // Trả kết quả về trong Service 
      return getNewBoard
    } catch (error) {throw error }

}   

const getDetails = async (boardId) => {
    try {  
    const board = await boardModel.getDetails(boardId)
    if(!board){
        throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found !')
    }

    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
        column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id) )
        // column.cards = resBoard.cards.filter(card => card.columnId === column._id)
    })

    delete resBoard.cards

    return resBoard
    } catch (error) {throw error }

}  

export const boardService = {
    createdNew,
    getDetails
}