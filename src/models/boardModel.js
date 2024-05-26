
import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

// Denfine Colection( Name & Schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid('public', 'private').required(),

    ownerIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
    memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

    columnOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)

})

const INVALID_UPDATE_FIELDS = ['_id','createdAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const getAll = async () => {
  try {
      // Thực hiện truy vấn cơ sở dữ liệu để lấy tất cả các bảng
      const boards = await GET_DB().collection(BOARD_COLLECTION_NAME).find({}).toArray()
      return boards
  } catch (error) {
      throw new Error(error)
  }
}
const createdNew = async (data) => {
  try {
      const validData = await validateBeforeCreate(data);

      // Chuyển đổi ownerIds từ string sang ObjectId nếu có
      if (validData.ownerIds && validData.ownerIds.length > 0) {
          validData.ownerIds = validData.ownerIds.map(ownerId => new ObjectId(ownerId));
      }


      return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData);
  } catch (error) {
      throw new Error(error);
  }
}


const findOneById = async (id) =>{
    try {
      const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
        _id: new ObjectId(id)
      })
      return result
    } catch (error) {throw new Error(error)}
}

const getDetails = async (id) =>{
  try {
    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
    // _id: new ObjectId(id)
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(id),
        _destroy: false
      } },
      { $lookup: {
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField:'boardId',
        as: 'columns'
      } },
      {$lookup: {
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField:'boardId',
        as: 'cards'
      } }
    ]).toArray()
    return result[0] || null
  } catch (error) {throw new Error(error)}
}

// Nhiệm vụ của func này là push một giá trị columnId vào cuối mạng columnOrderIds
const pushColumnOrderIds = async (column) => {

  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds:new ObjectId(column._id) } },
      { returnDocument: 'after'}
    )
    return result
  } catch (error) {throw new Error(error)}
}
const pullColumnOrderIds = async (column) => {

  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds:new ObjectId(column._id) } },
      { returnDocument: 'after'}
    )
    return result
  } catch (error) {throw new Error(error)}
}
const update = async (boardId,updateData) => {

  try {
    Object.keys(updateData).forEach(filedName =>{
      if(INVALID_UPDATE_FIELDS.includes(filedName)){
        delete updateData[filedName]
      }
    })
     // Kiểm tra và chuyển đổi ownerId thành một mảng ObjectId nếu nó không phải là mảng
     if (updateData.ownerIds && !Array.isArray(updateData.ownerIds)) {
      updateData.ownerIds = [updateData.ownerIds];
    }

    // Chuyển đổi ownerId thành ObjectId trong mảng nếu nó tồn tại
    if (updateData.ownerIds) {
      updateData.ownerIds = updateData.ownerIds.map(ownerId => new ObjectId(ownerId));
    }
    // Kiểm tra và chuyển đổi memberIds thành mảng ObjectId nếu nó không phải là mảng
    if (updateData.memberIds && !Array.isArray(updateData.memberIds)) {
      updateData.memberIds = [updateData.memberIds];
    }

    // Chuyển đổi memberIds thành ObjectId trong mảng nếu nó tồn tại
    if (updateData.memberIds) {
      updateData.memberIds = updateData.memberIds.map(memberId => new ObjectId(memberId));
    }
    if(updateData.columnOrderIds){
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => new ObjectId(_id))
    }
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set:  updateData },
      { returnDocument: 'after'}
    )
    return result
  } catch (error) {throw new Error(error)}
}
const deleteOneById = async (boardId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(boardId)
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getUserBoards = async (ownerIds) => {
  try {
    // Chuyển ownerIds thành một mảng nếu nó không phải là mảng
    if (!Array.isArray(ownerIds)) {
      ownerIds = [ownerIds];
    }

    // Chuyển memberIds thành một mảng nếu nó không phải là mảng
    

    // Truy vấn cơ sở dữ liệu sử dụng mảng các ObjectId đã chuyển đổi
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          $or: [
            { ownerIds: { $in: ownerIds.map(id => new ObjectId(id)) } },
            { memberIds: { $in: ownerIds.map(id => new ObjectId(id)) } }
          ],
          _destroy: false
        }
      },
      {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      }
    ]).toArray();
    
    return result;
  } catch (error) {
    console.error("Error in getUserBoards:", error); // Ghi log nếu có lỗi xảy ra
    throw error;
  }
}

const findOneAndUpdate = async (filter, updateData, options) => {
  try {
    // Thực hiện truy vấn và cập nhật tài liệu trong cơ sở dữ liệu
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      filter,
      updateData,
      options
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    getAll,
    createdNew,
    findOneById,
    getDetails,
    pushColumnOrderIds,
    update,
    pullColumnOrderIds,
    deleteOneById,
    getUserBoards,
    findOneAndUpdate,
}

