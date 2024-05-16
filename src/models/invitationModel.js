  import Joi from 'joi';
  import { ObjectId } from 'mongodb';
  import { GET_DB } from '~/config/mongodb';
  import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

  const INVITATION_COLLECTION_NAME = 'invitations';
  const INVITATION_COLLECTION_SCHEMA = Joi.object({
    boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    invitedBy: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    invitedUserEmail: Joi.string().email().required(),
    invitedUserId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), // Thêm trường invitedUserId
    status: Joi.string().valid('pending', 'accepted', 'declined').default('pending'),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null)
  });
  
  const validateBeforeCreate = async (data) => {
    return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
  };

  const createNew = async (data) => {
    try {
      const validData = await validateBeforeCreate(data);
      validData.boardId = new ObjectId(validData.boardId);
      validData.invitedBy = new ObjectId(validData.invitedBy);
      // Kiểm tra nếu đã có invitedUserId trong dữ liệu mời
      if (validData.invitedUserId && validData.invitedBy === validData.invitedUserId) {
        throw new Error('invitedUserId should not be provided before user registration');
    }
    if (validData.invitedUserId) {
      validData.invitedUserId = new ObjectId(validData.invitedUserId);
  } 
      // Tạo bản ghi mời
      const insertedInvitation = await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(validData);
      
      // Gửi email mời sau khi tạo mới lời mời thành công
  
      return insertedInvitation;
    } catch (error) {
      throw new Error(`Failed to create a new invitation: ${error.message}`);
    }
  };
  

  const findOneById = async (id) => {
    try {
      const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
      return result;
    } catch (error) {
      throw new Error(`Failed to find invitation by ID: ${error.message}`);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } },
        { returnDocument: 'after' } // Chú ý: đây là tùy chọn của MongoDB, không liên quan đến Joi
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to update invitation status: ${error.message}`);
    }
  };
  const updateInvitedUserId = async (email, invitedUserId) => {
    try {
        const objectIdUserId = new ObjectId(invitedUserId); // Chuyển đổi userId thành ObjectId

        const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
            { invitedUserEmail: email },
            { $set: { invitedUserId: objectIdUserId } }, // Sử dụng ObjectId để cập nhật invitedUserId
            { returnDocument: 'after' }
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update invitedUserId: ${error.message}`);
    }
}
const findInvitationsByUserId= async(invitedUserId) =>{
  try {
    const invitations = await GET_DB().collection(INVITATION_COLLECTION_NAME).find({ invitedUserId: new ObjectId(invitedUserId) }).toArray();
    return invitations;
  } catch (error) {
    throw new Error(`Failed to find invitations by userId: ${error.message}`);
  }
}
  // Thêm hàm updateInvitedUserId vào export
  export const invitationModel = {
    INVITATION_COLLECTION_NAME,
    INVITATION_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    updateStatus,
    updateInvitedUserId, 
    findInvitationsByUserId
  };
  

