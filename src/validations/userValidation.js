import Joi from "joi";
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const loginUser = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details.map(detail => detail.message)));
    }
};
const createUser = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        username: Joi.string().min(3).max(30).required(),
        displayName: Joi.string().min(3).max(50),
        avatar: Joi.string().uri(),
        role: Joi.string().valid('admin', 'user').default('user'),
        isActive: Joi.boolean().default(true),
        verifyToken: Joi.string().allow(null),
        createdAt: Joi.date().timestamp('javascript').default(Date.now),
        updatedAt: Joi.date().timestamp('javascript').default(null)
    });

    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details.map(detail => detail.message)));
    }
};

const updateUser = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string().min(6),
        username: Joi.string().min(3).max(30),
        displayName: Joi.string().min(3).max(50),
        avatar: Joi.string().uri(),
        role: Joi.string().valid('admin', 'user'),
        isActive: Joi.boolean(),
        verifyToken: Joi.string().allow(null),
        updatedAt: Joi.date().timestamp('javascript').default(Date.now)
    });

    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details.map(detail => detail.message)));
    }
};

const deleteUser = async (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string().required()
    });

    try {
        await schema.validateAsync(req.params);
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details.map(detail => detail.message)));
    }
};

export const userValidation = {
    loginUser,
    createUser,
    updateUser,
    deleteUser
};
