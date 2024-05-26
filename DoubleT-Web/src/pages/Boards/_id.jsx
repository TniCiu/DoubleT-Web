import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom' // Import useParams từ react-router-dom
import { 
  fetchBoardDetailsAPI, 
  createNewColumnAPI, 
  createNewCardAPI,
  updateBoardDetailsAPI,
  updatecolumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Typography } from '@mui/material'
import {toast} from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null)
  const { id } = useParams() // Lấy id từ đường dẫn
  const [selectedImage, setSelectedImage] = useState(null)
  
  const handleFileChange = (imageUrl) => {
    setSelectedImage(imageUrl)
  }
  useEffect(() => {
    // Gọi API để lấy chi tiết của board với id được truyền qua đường dẫn
    if (id) {
      fetchBoardDetailsAPI(id).then(board => {
        board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

        board.columns.forEach(column => {
          if (isEmpty(column.cards)){
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          }else{
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
        setBoard(board)
      })
    }
  }, [id,selectedImage])

  const createNewColumn = async (newColumnData) => {
    let createdColumn
    if (board) {
      createdColumn = await createNewColumnAPI({
        ...newColumnData,
        boardId: board._id // Sử dụng id của board
      })
    } else {
      console.error('Board is not loaded yet.')
      return
    }

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    const newBoard = { ...board }
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  

  const createNewCard = async (newCardData) => {
    let createdCard
    if (board) {
      createdCard = await createNewCardAPI({
        ...newCardData,
        boardId: board._id // Sử dụng id của board
      });
    } else {
      console.error('Board is not loaded yet.');
      return
    }
  
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {

      if(columnToUpdate.cards.some(card =>card.FE_PlaceholderCard)){
        columnToUpdate.cards =[createdCard]
        columnToUpdate.cardOrderIds.push[createdCard._id]

      }else{
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id) 
      }
        
    }
    setBoard(newBoard)
  }
  const updateColumnTitle = async (columnId, newTitle) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.title = newTitle
      setBoard(newBoard)
    }
    updatecolumnDetailsAPI(columnId, { title: newTitle })
      .then(() => {
        toast.success("Column title updated successfully")
      })
      .catch((error) => {
        toast.error("Failed to update column title: " + error.message)
      })
  }
  
  
  const moveColums = (dndOrderedColumns) =>{
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id )
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    updateBoardDetailsAPI(newBoard._id,{columnOrderIds:  newBoard.columnOrderIds})
  }

  const moveCardInTheSameColumn = (dndOrderedCards,dndOrderedCardsIds,columnId) =>{
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(newBoard)
    
    updatecolumnDetailsAPI(columnId,{ cardOrderIds: dndOrderedCardsIds })
  } 
  if(!board){
    return (
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap:2,
        with:'100vw',
        height:'100vh'
        }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    );
  }

  const deleteColumnDetails = (columnId) => {
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }


/**
 * Khi di chuyển card sang Column khác:
 * B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (là xóa _id của Card ra khỏi mảng)
 * B2: Cập nhật mảng cardOrderIds của Column tiếp theo (thêm _id vào mảng)
 * B3: Cập nhật lại trường ColumbId mới vào cái Card đã kéo 
 * => làm một API support riêng.
 */
  const moveCardToDifferentColumn = (
    currentCardId, 
    prevColumnId, 
    nextColumnId,
    dndOrderedColumns
  ) =>{
    
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id )
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)
    
    let prevCard0rderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds || []
    if(prevCard0rderIds[0].includes('placeholder-card')) prevCard0rderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId, 
      prevCard0rderIds,
      nextColumnId,
      nextCard0rderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds


    })

  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar selectedImage={selectedImage}/>
      <BoardBar board={board} selectedImage={selectedImage} onFileChange={handleFileChange} />
      <BoardContent 
        board={board} 

        createNewColumn={createNewColumn}  
        createNewCard={createNewCard} 
        updateColumnTitle = {updateColumnTitle} 
        moveColums = {moveColums}
        moveCardInTheSameColumn = {moveCardInTheSameColumn}
        moveCardToDifferentColumn ={moveCardToDifferentColumn}
        deleteColumnDetails = {deleteColumnDetails}
        selectedImage={selectedImage}
      />
    </Container>
  )
}

export default Board
