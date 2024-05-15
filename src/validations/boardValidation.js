import { StatusCodes } from 'http-status-codes'
import Joi from "joi"
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict(),
        description: Joi.string().required().min(3).max(256).trim().strict(),
        type: Joi.string().valid('public', 'private').required(),
        ownerIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
        memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([])
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

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
const deleteBoard = async (req, res, next) => {
    
    const correctCondition = Joi.object({
        id:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
        
    })
    try {
        
        await correctCondition.validateAsync(req.params)
        next()
        
    } catch (error) {
        next(new ApiError( StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))  

    }
}
export const boardValidation = {
    createNew,
    update,
    moveCardToDifferentColumn,
    deleteBoard
}       