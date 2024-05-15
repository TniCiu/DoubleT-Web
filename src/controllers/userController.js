import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Gọi service để kiểm tra đăng nhập
        const user = await userService.loginUser(email, password);
        if (user) {
            res.status(StatusCodes.OK).json({ ownerIds: user._id, message: 'Login successful!' });
            
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Login failed. Invalid email or password.' });
        }
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const users = await userService.getAll();
        res.status(StatusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(StatusCodes.CREATED).json(newUser);
    } catch (error) {
        next(error);
    }
};

const getUserDetails = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserDetails(userId);
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updatedUser = await userService.updateUser(userId, req.body);
        res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        await userService.deleteUser(userId);
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
        next(error);
    }
};

export const userController = {
    loginUser,
    getAll,
    createUser,
    getUserDetails,
    updateUser,
    deleteUser
};
