import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/boardModel";

const loginUser = async (email, password) => {
    try {
        // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password.');
        }
       
        // Kiểm tra mật khẩu
        const isPasswordValid = await userModel.comparePassword(user._id, password);
        if (!isPasswordValid) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password.');
        }
        // Nếu email và mật khẩu hợp lệ, trả về thông tin người dùng
        return user
    } catch (error) {
        throw error;
    }
};
const getAll = async () => {
    try {
        const users = await userModel.getAll();
        return users;
    } catch (error) {
        throw error;
    }
};

const createUser = async (userData) => {
    try {
        // Thêm bất kỳ xử lý logic nào cần thiết ở đây (ví dụ: mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu)
        const Singup = await userModel.createUser(userData);
        return {ownerIds:Singup.insertedId ,message: 'Sign Up successful!' }
    } catch (error) {
        throw error;
    }
};

const getUserDetails = async (userId) => {
    try {
        const user = await userModel.getUserDetails(userId);
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
        }

        // Thêm bất kỳ xử lý nào cần thiết cho thông tin chi tiết của người dùng (ví dụ: loại bỏ mật khẩu trước khi trả về)

        return user;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (userId, updateData) => {
    try {
        // Thêm bất kỳ xử lý logic nào cần thiết ở đây (ví dụ: kiểm tra và cập nhật mật khẩu nếu được thay đổi)
        return await userModel.updateUser(userId, updateData);
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (userId) => {
    try {
        // Thêm bất kỳ xử lý logic nào cần thiết ở đây (ví dụ: xóa tất cả dữ liệu liên quan đến người dùng trước khi xóa người dùng)
        return await userModel.deleteUser(userId);
    } catch (error) {
        throw error;
    }
};
const getUserWithBoards = async (userId) => {
    try {
        // Lấy thông tin của người dùng từ userModel
        const user = await userModel.getUserDetails(userId);
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
        }
        
        // Lấy thông tin của các boards mà người dùng đã tạo hoặc tham gia từ boardModel
        const userBoards = await boardModel.getUserBoards(userId);

        // Kết hợp thông tin của người dùng và các boards và trả về
        const userDataWithBoards = {
            ...user,
            boards: userBoards
        };

        return userDataWithBoards;
    } catch (error) {
        throw error;
    }
};

export const userService = {
    loginUser,
    getAll,
    createUser,
    getUserDetails,
    updateUser,
    deleteUser,
    getUserWithBoards
};
