import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { DndContext, PointerSensor, useSensor,
  useSensors, MouseSensor, TouchSensor,
  DragOverlay, defaultDropAnimationSideEffects, closestCorners,
  pointerWithin, getFirstCollision }
  from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState,useCallback } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'

import {generatePlaceholderCard} from '~/utils/formatters'
import { useRef } from 'react'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN : 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD : 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ 
  board, 
  selectedImage,
  createNewColumn,
  createNewCard,
  updateColumnTitle,
  moveColums,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails
 }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint:{ distance : 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint:{ distance : 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint:{ delay : 250, tolerance : 5 } })
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(pointerSensor, touchSensor)
  const [orderedColumnsState, setOrderedColumnsState] = useState([])


  const [activeDragItemId, setactiveDragItemId] = useState([null])
  const [activeDragItemType, setactiveDragItemType] = useState([null])
  const [activeDragItemData, setactiveDragItemData] = useState([null])
  const [oldColumnWhenDarggingCard, setOldColumnWhenDarggingCard] = useState([null])
  const lastOverID = useRef(null)

  useEffect(() => {
    setOrderedColumnsState(board.columns)
  }, [board]);
  
  const findColumnByCardId = (cardId) => {
    return orderedColumnsState.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  //Khởi tạo Fuc chung
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardData,
    activeDraggingCardId,
    triggerFrom
  ) => {
    setOrderedColumnsState(prevColumns => {
      // tim vi tri trong col noi card sap duoc tha
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      // logic tinh toan card index moi moi khi dc keo'
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 :0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn.length + 1

      // clone mang cu~ OrderCol ra 1 cai roi xu ly data , return de cap nhat lai vi tri
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
      if (nextActiveColumn) {
        // xoa card o Col cu~
        nextActiveColumn.cards=nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // cap nhat lai mang sau khi xoa
        nextActiveColumn.cardOrderIds= nextActiveColumn.cards.map( card => card._id)
      }
      if (nextOverColumn) {
        // kiem tra xem card đã tồn tại trước đó trong col hay chưa
        nextOverColumn.cards=nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // thêm card đã kéo vào col ở vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card. FE_PlaceholderCard)

        // cap nhat lai du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map( card => card._id)
      }
      
      if(triggerFrom === 'handleDragEnd'){
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDarggingCard._id,
          nextOverColumn._id,
          nextColumns
        )
      }
      return nextColumns
    })
  }
  const handleDragStart = (event) => {

    setactiveDragItemId(event?.active?.id)
    setactiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD :
      ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setactiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDarggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  // qua trinh keo 1 phan tu
  const handleDragOver = (event) => {
    // ko lam gi khi dang keo col
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) return
    // xu li neu keo card giua cac col
    const { active, over } = event
    if ( !active ||!over) return
    // over la cai card Dang tuong tac
    const { id : activeDraggingCardId, data : { current :activeDraggingCardData } } = active
    const { id : overCardId } = over
    // tim 2 cai col theo card
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // neu ton tai 1 trong 2 col thi k lam gi het
    if (!activeColumn || !overColumn) return


    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardData,
        activeDraggingCardId,
        'handleDragOver'
      )
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if ( !active ||!over) return

    // keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {

      // over la cai card Dang tuong tac
      const { id : activeDraggingCardId, data : { current :activeDraggingCardData } } = active
      const { id : overCardId } = over
      // tim 2 cai col theo card
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // neu ton tai 1 trong 2 col thi k lam gi het
      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDarggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardData,
          activeDraggingCardId,
          'handleDragEnd'
        )
      } else {
        // hanh dong keo tha card trong cung col
        const oldCardIndex = oldColumnWhenDarggingCard?.cards.findIndex(c => c._id == activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id == overCardId)

        // dung arrry move de keo tha
        const dndOrderedCards = arrayMove(oldColumnWhenDarggingCard?.cards, oldCardIndex, newCardIndex )
        const dndOrderedCardsIds = dndOrderedCards.map(card => card._id)

        setOrderedColumnsState(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          // tim toi col muon drag
          const targetColumn = nextColumns.find(column => column._id == overColumn._id)
          // cap nhat lai 2 gia tri card va CardOrder
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardsIds
          // tra ve gia tri state moi
          return nextColumns
        })

        moveCardInTheSameColumn(dndOrderedCards,dndOrderedCardsIds,oldColumnWhenDarggingCard._id)
      }
    }
    // xu ly keo tha
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumnsState.findIndex(c => c._id == active.id)
        const newColumnIndex = orderedColumnsState.findIndex(c => c._id == over.id)
        const dndOrderedColumns = arrayMove(orderedColumnsState, oldColumnIndex, newColumnIndex )

        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns:', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds:', dndOrderedColumns)
        setOrderedColumnsState(dndOrderedColumns)
        moveColums(dndOrderedColumns)
        
      }
    }


    setactiveDragItemId(null)
    setactiveDragItemType(null)
    setactiveDragItemData(null)
    setOldColumnWhenDarggingCard(null)

  }

  const customDropAnimation = {
    sideEffects : defaultDropAnimationSideEffects({
      styles : {
        active: {
          opacity : 0.5
        }
      }
    })
  }

// custom lai thuat toan
const collisionDetectionStrategy = useCallback((args) => {
  if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
    return closestCorners({ ...args })
  }
  const pointerIntersections = pointerWithin(args)
  if (!pointerIntersections?.length ) return

  // const intersections = !!pointerIntersections?.length
  //   ? pointerIntersections
  //   : rectIntersection(args)

  let overID = getFirstCollision(pointerIntersections, 'id')
  if (overID) {
    const checkColumn = orderedColumnsState.find(column => column._id === overID)
    if (checkColumn) {
      overID = closestCorners({
        ... args,
        droppableContainers : args.droppableContainers.filter(container => {
          return (container.id !== overID ) && (checkColumn?.cardOrderIds?.includes(container.id))
        })
      })[0] ?.id
    }
    lastOverID.current =overID
    return [{ id : overID }]
  }
  return lastOverID.current ? [{ id : lastOverID.current }] : []
}, [activeDragItemType, orderedColumnsState])

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors = {sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={ handleDragOver}
    >
      <Box sx = {{
        bgcolor : (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#0984e3' ),
        width :'100%',
        height: (theme) => theme.trello.boardContentHeight,
        p : '10px 0',
        backgroundImage: selectedImage ? `url(${selectedImage})` : 'none',

      }}>
        <ListColumns 
        board={board}
        columns = {orderedColumnsState} 
        createNewColumn = {createNewColumn}
        createNewCard = {createNewCard}
        updateColumnTitle={updateColumnTitle}
        deleteColumnDetails ={deleteColumnDetails}
        />
        <DragOverlay dropAnimation={customDropAnimation }>
          {( !activeDragItemType) && null }
          {( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}  />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
