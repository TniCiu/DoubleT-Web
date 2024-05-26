import { cardModel } from "~/models/cardModel"
import { columnModel } from "~/models/columnModel"
import { userModel } from "~/models/userModel"
import { v2 as cloudinary } from 'cloudinary';

const createdNew = async (reqBody) => {
    try {  
        const newCard = {
            ...reqBody
           
        }


    const createdCard = await cardModel.createdNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)
    if(getNewCard) {

        // Cập nhật mảng columOrderIds trong collection Boards
        await columnModel.pushCardOrderIds(getNewCard)
    }
      return getNewCard
    } catch (error) {throw error }

}   

const uploadImageToCloudinary = async (imagePath) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath);
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error(error);
    }
};
const update = async (cardId, reqBody) => {
  try {
    const currentCard = await cardModel.findOneById(cardId);
    if (!currentCard) {
      throw new Error('Card not found');
    }

    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    };

    // Check if 'cover' is present in the request body
    if (reqBody.cover !== undefined) {
      updateData.cover = await uploadImageToCloudinary(reqBody.cover);
    }

    // Handle comments
    if (reqBody.comments) {
      if (!Array.isArray(reqBody.comments)) {
        throw new Error('Comments should be an array');
      }

      const currentComments = currentCard.comments || [];
      const newComments = reqBody.comments.filter(comment => {
        // Kiểm tra xem bình luận mới đã tồn tại trong danh sách hiện tại chưa
        return !currentComments.some(existingComment => existingComment.content === comment.content);
      });

      updateData.comments = [...currentComments, ...newComments];
    }

    const updatedCard = await cardModel.update(cardId, updateData);
    return updatedCard;
  } catch (error) {
    console.error('Failed to update card details:', error);
    throw error;
  }
};


const addMemberToCard = async (cardId, memberId) => {
    try {
        // Kiểm tra xem memberId có tồn tại trong userModel hay không
        const member = await userModel.getUserDetails(memberId)
        if (!member) {
            throw new Error('Member not found')
        }

        // Lấy thông tin tên người dùng và ảnh đại diện của thành viên từ userModel
        const { username, avatar } = member;

        // Cập nhật thẻ để thêm member
        const updatedCard = await cardModel.addMember(cardId, memberId, username, avatar)

        // Trả về thẻ đã được cập nhật
        return updatedCard;
    } catch (error) {
        throw new Error('Failed to add member to card: ' + error.message);
    }
}



export const cardService = {
    createdNew,
    update,
    addMemberToCard
}