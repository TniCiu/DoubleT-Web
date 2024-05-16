import { invitationModel } from '~/models/invitationModel';
import { boardModel } from '~/models/boardModel';
import { emailService } from '~/services/emailService';
import { ObjectId } from 'mongodb';

import { userModel } from '~/models/userModel';

const createInvitation = async (data) => {
    try {
        // Bạn có thể xác định userId của người dùng dựa trên email đã được mời
        const invitedUser = await userModel.getUserByEmail(data.invitedUserEmail);

        // Nếu không tìm thấy người dùng với email đã mời, bạn có thể xử lý tùy thuộc vào yêu cầu của ứng dụng của mình
        if (!invitedUser) {
            throw new Error('Invited user not found');
        }

        // Chuyển đổi ObjectId thành chuỗi
        const invitedUserId = invitedUser._id.toString();

        // Gán invitedUserId vào dữ liệu mời
        data.invitedUserId = invitedUserId;


        const invitation = await invitationModel.createNew(data);
        // Logic to send email or notification
        return invitation;
    } catch (error) {
        throw new Error(`Service error: ${error.message}`);
    }
};


const acceptInvitation = async (invitationId) => {
  try {
    // Lấy thông tin lời mời
    const invitation = await invitationModel.findOneById(invitationId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    // Kiểm tra xem lời mời có đang ở trạng thái pending không
    if (invitation.status !== 'pending') {
      throw new Error('Invitation has already been processed');
    }

    // Cập nhật trạng thái của lời mời
    const updatedInvitation = await invitationModel.updateStatus(invitationId, 'accepted');

    // Lấy thông tin board mà lời mời được gửi đến
    const board = await boardModel.findOneById(invitation.boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    const invitedUserId = invitation.invitedUserId;

    // Chuyển đổi invitedUserId thành ObjectId
    const invitedUserObjectId = new ObjectId(invitedUserId);

    // Thêm memberId vào danh sách memberIds của board
    const updatedBoard = await boardModel.findOneAndUpdate(
      { _id: board._id },
      { $addToSet: { memberIds: invitedUserObjectId } },
      { returnDocument: 'after' }
    );

    return { updatedInvitation, updatedBoard };
  } catch (error) {
    throw new Error(`Service error: ${error.message}`);
  }
};


const declineInvitation = async (id) => {
  try {
    const updatedInvitation = await invitationModel.updateStatus(id, 'declined');
    return updatedInvitation;
  } catch (error) {
    throw new Error(`Service error: ${error.message}`);
  }
};

const getInvitationsByUserId = async (invitedUserId) =>{
  try {
    return await invitationModel.findInvitationsByUserId(invitedUserId);
  } catch (error) {
    throw new Error(`Service error: ${error.message}`);
  }
}

export const invitationService = {
  createInvitation,
  acceptInvitation,
  declineInvitation,
  getInvitationsByUserId
};
