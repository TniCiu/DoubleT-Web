import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
import { boardModel } from '~/models/boardModel'
const getAll = async (req, res, next) => {
    try {
        // Gọi hàm từ service để lấy danh sách các bảng
        const boards = await boardService.getAll()

        // Trả về danh sách các bảng dưới dạng JSON
        res.status(StatusCodes.OK).json(boards)
    } catch (error) {
        // Nếu có lỗi, chuyển tiếp lỗi tới middleware xử lý lỗi tiếp theo
        next(error)
    }
}

const createNew = async (req, res, next) => {
    try {
        // console.log('req.body:',req.body)
        // console.log('req.query:',req.query)
        // console.log('req.params:',req.params)

        // Điều hướng dữ liệu sang tâng Service
        const createBoard = await boardService.createdNew(req.body)

        // Có kết quả thì trả về phía Client 
        res.status(StatusCodes.CREATED).json(createBoard)
        
    } catch (error) { next(error) }

}

const getDetails = async (req, res, next) => {
    try {
        // console.log('req.params:',req.params)
        const boardId = req.params.id

        const board = await boardService.getDetails(boardId)

        // Có kết quả thì trả về phía Client 
        res.status(StatusCodes.OK).json(board)
        
    } catch (error) { next(error) }

}
const update = async (req, res, next) => {
    try {
        const boardId = req.params.id

        const updateBoard = await boardService.update(boardId,req.body)

        // Có kết quả thì trả về phía Client 
        res.status(StatusCodes.OK).json(updateBoard)
    } catch (error) { next(error) }

}

const deleteBoard = async (req, res) => {
    const { id } = req.params;
    try {
        // Gọi hàm xóa board từ service hoặc repository
        const result = await boardService.deleteBoard(id)
        res.status(StatusCodes.OK).json(result) // Trả về mã trạng thái 204 - No Content nếu xóa thành công
    } catch (error) {
        console.error('Error deleting board:', error)
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR) // Trả về mã trạng thái 500 - Internal Server Error nếu có lỗi xảy ra
    }
}

const moveCardToDifferentColumn = async (req, res, next) => {
    try {

        const result = await boardService.moveCardToDifferentColumn(req.body)
        // Có kết quả thì trả về phía Client 
        res.status(StatusCodes.OK).json(result)
    } catch (error) { next(error) }

}

const getUserBoards = async (req, res) => {
    let ownerIds = req.params.ownerIds; // Lấy giá trị của ownerIds từ req.params
    console.log(ownerIds);

    // Chuyển ownerIds thành một mảng nếu nó không phải là mảng
    if (!Array.isArray(ownerIds)) {
        ownerIds = [ownerIds];
    }
    try {
        const boards = await boardService.getUserBoards(ownerIds);
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const boardController = {
    getAll,
    createNew,
    getDetails,
    update,
    moveCardToDifferentColumn,
    deleteBoard,
    getUserBoards
}