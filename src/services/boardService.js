import { slugify } from "~/utils/formatters"
import { boardModel } from "~/models/boardModel"

const createdNew = async (reqBody) => {
    try {  
    // Làm thêm các xử lý logic tùy đặc thủ đồ án 
    
        const newBoard = {
            ...reqBody,
            sluq: slugify(reqBody.title)
        }


    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database 
    const createdBoard = await boardModel.createdNew(newBoard)
    console.log(createdBoard)

    // Lấy bản ghi board sau khi gọi 
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    console.log(getNewBoard)
    // Làm thêm các xử lý logic với các Collection khác tùy đặc thủ đồ án  
    // Notification về cho admin khi có 1 cái Board mới được tạo 


    // Trả kết quả về trong Service 
      return getNewBoard
    } catch (error) {throw error }

}   



export const boardService = {
    createdNew
}