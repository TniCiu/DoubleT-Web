import { cardModel } from "~/models/cardModel"
import { columnModel } from "~/models/columnModel"
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

   
 

export const cardService = {
    createdNew
}