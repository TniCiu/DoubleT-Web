import axios from 'axios'
import { API_ROOT } from '~/utils/constans'
// user
export const loginAPI = async (credentials) => {
    try {
        // Gửi yêu cầu POST đến endpoint đăng nhập của máy chủ API với thông tin đăng nhập
        const response = await axios.post(`${API_ROOT}/v1/Users/login`, credentials);
        return response.data; // Trả về dữ liệu từ phản hồi của máy chủ API
    } catch (error) {
        throw error; // Xử lý lỗi nếu có
    }
};
export const signupAPI = async (userData) => {
    try {
        const response = await axios.post(`${API_ROOT}/v1/Users/`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchUserBoardsAPI = async (ownerIds) => {
    try {
        const response = await axios.get(`${API_ROOT}/v1/boards/users/${ownerIds}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUserInfoAPI = async (userId) => {
    try {
        const response = await axios.get(`${API_ROOT}/v1/Users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserInfoAPI = async (userId, updateData) => {
    try {
        const response = await axios.put(`${API_ROOT}/v1/Users/${userId}`, updateData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchInforUserBoardsAPI = async (ownerIds) => {
    try {
        const response = await axios.get(`${API_ROOT}/v1/boards/${ownerIds}/members`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
//Boards 
export const fetchAllBoardsAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/boards`);
    return response.data
}
export const fetchBoardDetailsAPI = async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

    return response.data

}
export const updateBoardDetailsAPI = async (boardId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)

    return response.data

}
export const moveCardToDifferentColumnAPI = async (updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_cards`, updateData)

    return response.data

}

export const createNewBoardAPI = async (newBoardData) => {
    const response = await axios.post(`${API_ROOT}/v1/boards`, newBoardData)
    return response.data
}

export const deleteBoardDetailsAPI = async (boardId) => {
    const response = await axios.delete(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
}



//Columns 
export const createNewColumnAPI = async (newColumnData) => {
    const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)

    return response.data
 
}
export const updatecolumnDetailsAPI = async (columnId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)

    return response.data

}
export const deleteColumnDetailsAPI = async (columnId) => {
    const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)

    return response.data

}
//Cards
 export const createNewCardAPI = async (newCardData) => {
     const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
    
    return response.data
  }
  export const updateCardDetailsAPI = async (cardId, updatedFields) => {
    try {
      const response = await axios.put(`${API_ROOT}/v1/cards/${cardId}`, updatedFields);
      return response.data;
    } catch (error) {
      console.error('Failed to update card details:', error);
      throw error;
    }
  };
  export const addMemberToCardAPI = async (cardId, memberId) => {
    try {
        const response = await axios.post(`${API_ROOT}/v1/cards/${cardId}/members`, { memberId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// invitation
export const fetchInvitationsAPI = async (invitedUserId) => {
    try {
        const response = await axios.get(`${API_ROOT}/v1/Invitation/invited/${invitedUserId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendInvitationAPI = async (invitationData) => {
    try {
        const response = await axios.post(`${API_ROOT}/v1/Invitation`, invitationData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const acceptInvitationAPI = async (invitationId) => {
    try {
        const response = await axios.patch(`${API_ROOT}/v1/Invitation/${invitationId}/accept`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const declineInvitationAPI = async (invitationId) => {
    try {
        const response = await axios.patch(`${API_ROOT}/v1/Invitation/${invitationId}/decline`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

