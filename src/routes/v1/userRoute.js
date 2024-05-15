import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userValidation } from '~/validations/userValidation';
import { userController } from '~/controllers/userController';

const Router = express.Router();

// Đăng nhập người dùng
Router.post('/login', userValidation.loginUser, userController.loginUser);

Router.route('/')
    .get(userController.getAll)
    .post(userValidation.createUser, userController.createUser);

Router.route('/:id')
    .get(userController.getUserDetails)
    .put(userValidation.updateUser, userController.updateUser)
    .delete(userValidation.deleteUser, userController.deleteUser);


    
export const userRoute = Router;
