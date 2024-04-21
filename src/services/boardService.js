import { slugify } from "~/utils/formatters"


const createdNew = async (reqBody) => {
    try {  
    // Làm thêm các xử lý logic tùy đặc thủ đồ án 
    
        const newBoard = {
            ...reqBody,
            sluq: slugify(reqBody.title)
        }


    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database 
    // ...
    
    // Làm thêm các xử lý logic với các Collection khác tùy đặc thủ đồ án  
    // Notification về cho admin khi có 1 cái Board mới được tạo 


    // Trả kết quả về trong Service 
      return newBoard
    } catch (error) {throw error }

}   



export const boardService = {
    createdNew
}