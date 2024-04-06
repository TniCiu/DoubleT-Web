import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

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

  const handleDragStart = (event) => {
    console.log('handleDragStart:', event)
    setactiveDragItemId(event?.active?.id)
    setactiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD :
      ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setactiveDragItemData(event?.active?.data?.current)
  }

  const handleDragEnd = (event) => {
    console.log('handleDragEnd:', event)
    const { active, over } = event
    if (!over) return


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
