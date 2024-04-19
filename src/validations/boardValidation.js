import { StatusCodes } from 'http-status-codes'
import Joi from "joi"

const createNew = async (req, res, next) => {
    /**
     * Note: Mặc định chúng ta không cần phải custom message ở phía BE làm gì vì để cho FE tự 
     validate và custom message phía BE cho đẹp.
     * Back-end chỉ cần validate Đảm Bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là được
     * Quan trọng: việc validate dữ liệu BẮT BUỘC phải có phía BE vì đây là điểm cuối để lưu trữ dữ liệu vào Database
     * Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu cả BE và FE
     */
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict(),
        description: Joi.string().required().min(3).max(256).trim().strict(),
    })
    try {
        console.log('req.body:',req.body)
        // Gắn abortEarly = false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗi 
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        // next()

        res.status(StatusCodes.CREATED).json({ message: 'POST from Validation: API create new boards.' })

        
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            errors: new Error(error).message
        })
    }
    
}

export const boardValidation = {
    createNew
}