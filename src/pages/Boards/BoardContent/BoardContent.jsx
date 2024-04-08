import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN : 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD : 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint:{ distance : 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint:{ distance : 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint:{ delay : 250, tolerance : 5 } })
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(pointerSensor, touchSensor)
  const [orderedColumnsState, setOrderedColumnsState] = useState([])


  const [activeDragItemId, setactiveDragItemId] = useState([null])
  const [activeDragItemType, setactiveDragItemType] = useState([null])
  const [activeDragItemData, setactiveDragItemData] = useState([null])

  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumnsState(orderedColumns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumnsState.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    console.log('handleDragStart:', event)
    setactiveDragItemId(event?.active?.id)
    setactiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD :
      ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setactiveDragItemData(event?.active?.data?.current)
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
          // cap nhat lai mang sau khi xoa
          nextActiveColumn.cardOrderIds= nextActiveColumn.cards.map( card => card._id)
        }
        if (nextOverColumn) {
          // kiem tra xem card đã tồn tại trước đó trong col hay chưa
          nextOverColumn.cards=nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // thêm card đã kéo vào col ở vị trí index mới 
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // cap nhat lai du lieu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map( card => card._id)
        }
        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {
    console.log('handleDragEnd:', event)
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      return
    }
    const { active, over } = event
    if ( !active ||!over) return


    if (active.id !== over.id) {
      const oldIndex = orderedColumnsState.findIndex(c => c._id == active.id)
      const newIndex = orderedColumnsState.findIndex(c => c._id == over.id)
      const dndOrderedColumns = arrayMove(orderedColumnsState, oldIndex, newIndex )
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns:', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds:', dndOrderedColumns)
      setOrderedColumnsState(dndOrderedColumns)
    }
    setactiveDragItemId(null)
    setactiveDragItemType(null)
    setactiveDragItemData(null)
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


  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors = {sensors}
      onDragStart={handleDragStart}
      onDragOver={ handleDragOver}
    >
      <Box sx = {{
        bgcolor : (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#0984e3' ),
        width :'100%',
        height: (theme) => theme.trello.boardContentHeight,
        p : '10px 0'

      }}>
        <ListColumns columns = {orderedColumnsState} />
        <DragOverlay dropAnimation={customDropAnimation }>
          {( !activeDragItemType) && null }
          {( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
