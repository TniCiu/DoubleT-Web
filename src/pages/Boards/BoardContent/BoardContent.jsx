import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint:{ distance : 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint:{ distance : 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint:{ delay : 250 , tolerance : 5 } })
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(pointerSensor , touchSensor)
  const [orderedColumnsState, setOrderedColumnsState] = useState([])


  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumnsState(orderedColumns)
  }, [board])

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
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors = {sensors}>
      <Box sx = {{
        bgcolor : (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#0984e3' ),
        width :'100%',
        height: (theme) => theme.trello.boardContentHeight,
        p : '10px 0'

      }}>
        <ListColumns columns = {orderedColumnsState} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
