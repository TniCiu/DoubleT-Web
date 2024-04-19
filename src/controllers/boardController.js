import { StatusCodes } from 'http-status-codes'


const createNew = async (req, res, next) => {
    try {
        console.log('req.body:',req.body)
        console.log('req.query:',req.query)
        console.log('req.params:',req.params)
        res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: API create new boards.' })
        
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: error.message
        })
    }

}



export const boardController = {
    createNew
}