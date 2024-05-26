import Joi from 'joi';
import { ObjectId, ReturnDocument } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const USER_COLLECTION_NAME = 'users';

const USER_COLLECTION_SCHEMA = Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required().min(6),
    username: Joi.string().required().min(3).max(30).trim().lowercase(),
    displayName: Joi.string().min(3).max(50).trim(),
    avatar: Joi.string().uri().trim().allow(null), // Trường tùy chọn
    role: Joi.string().valid('admin', 'user').default('user'),
    isActive: Joi.boolean().default(true),
    verifyToken: Joi.string().default(null),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null)
});

const getAll = async () => {
    try {
        return await GET_DB().collection(USER_COLLECTION_NAME).find({}).toArray();
    } catch (error) {
        throw new Error(error);
    }
}

const validateBeforeCreate = async (data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex'); // 32 bytes converts to 64 characters in hexadecimal
}

const generateVerificationToken = () => {
    const secretKey = generateSecretKey();
    return jwt.sign({ data: 'verification' }, secretKey, { expiresIn: '1h' });
}

const createUser = async (userData) => {
    try {
        // Tạo một mã xác minh
        const verifyToken = generateVerificationToken();
        
        // Thêm trường verifyToken vào userData
        userData.verifyToken = verifyToken;

        // Gán giá trị null cho avatar nếu không được cung cấp
        if (!userData.avatar) {
            userData.avatar = null;
        }

        // Xác thực dữ liệu người dùng
        const validatedData = await validateBeforeCreate(userData);

        // Chèn dữ liệu người dùng vào cơ sở dữ liệu
        return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validatedData);
    } catch (error) {
        throw new Error(error);
    }
};

const findUserByEmail = async (email) => {
    try {
        return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: email });
    } catch (error) {
        throw new Error(error);
    }
};

const findUserByUsername = async (username) => {
    try {
        return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ username: username });
    } catch (error) {
        throw new Error(error);
    }
};

const updateUser = async (userId, updateData) => {
    try {
        return await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updateData },
            { returnDocument: ReturnDocument.AFTER }
        );
    } catch (error) {
        throw new Error(error);
    }
};

const deleteUserById = async (userId) => {
    try {
        return await GET_DB().collection(USER_COLLECTION_NAME).deleteOne({ _id: new ObjectId(userId) });
    } catch (error) {
        throw new Error(error);
    }
};

const getUserByEmail = async (email) => {
    try {
        return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: email });
    } catch (error) {
        throw new Error(error);
    }
};

const comparePassword = async (userId, password) => {
    try {
        const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error('User not found');
        }

        // So sánh mật khẩu được cung cấp với mật khẩu đã mã hóa được lưu trong cơ sở dữ liệu
        const isPasswordValid = (password === user.password);

        return isPasswordValid;
    } catch (error) {
        throw new Error('Error in comparePassword');
    }
}

const getUserDetails = async (userId) => {
    try {
        return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
    } catch (error) {
        throw new Error(error);
    }
}

export const userModel = {
    getAll,
    createUser,
    findUserByEmail,
    findUserByUsername,
    updateUser,
    deleteUserById,
    getUserByEmail,
    comparePassword,
    getUserDetails,
};
