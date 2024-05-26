import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
    try {     
        const createCard = await cardService.createdNew(req.body)

        res.status(StatusCodes.CREATED).json(createCard)
        
    } catch (error) { next(error) }

}

const update = async (req,res) => {
    try{
        const CardId = req.params.id
        const UpdateCard = await cardService.update(CardId,req.body)
        res.status(200).json(UpdateCard);    
    }catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const addMemberToCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { memberId } = req.body;
        const updatedCard = await cardService.addMemberToCard(cardId, memberId);
        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const cardController = {
    createNew,
    update,
    addMemberToCard
}