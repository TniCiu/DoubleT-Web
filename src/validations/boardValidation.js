import { StatusCodes } from 'http-status-codes'
import Joi from "joi"
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


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
        type: Joi.string().valid('public', 'private').required()
    })
    try {
        
        // Gắn abortEarly = false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗi 
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        // Validate dữ liệu xong xuôi hợp lệ thì cho request đi tiếp sang Controller
        next()
        
    } catch (error) {
        next(new ApiError( StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))  

    }
    
}
const update = async (req, res, next) => {
    
    const correctCondition = Joi.object({
        title: Joi.string().min(3).max(50).trim().strict(),
        description: Joi.string().min(3).max(256).trim().strict(),
        type: Joi.string().valid('public', 'private'),
        columnOrderIds: Joi.array().items(
            Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
        )
    })
    try {
        
        await correctCondition.validateAsync(req.body, { 
            abortEarly: false,
            allowUnknown: true
        
        })
        next()
        
    } catch (error) {
        next(new ApiError( StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))  

    }
    
}

const moveCardToDifferentColumn = async (req, res, next) => {
    const correctCondition = Joi.object({
        currentCardId:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        prevColumnId:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        prevCard0rderIds:Joi.array().required().items(
            Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),

        nextColumnId:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        nextCard0rderIds:Joi.array().required().items(
            Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
            
        
    })
    try {
        
        await correctCondition.validateAsync(req.body, { abortEarly: false})
        next()
        
    } catch (error) {
        next(new ApiError( StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))  

    }
    
}
export const boardValidation = {
    createNew,
    update,
    moveCardToDifferentColumn
}       