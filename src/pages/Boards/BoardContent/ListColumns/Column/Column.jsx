import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


function Column({ column }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    touchAction : 'none',
    transform: CSS.Translate.toString(transform),
    transition
  }


  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')


  return (

    <Box
      ref = {setNodeRef}
      style = {dndKitColumnStyles}
      {...attributes}
      {...listeners}
      sx = {{
        minWidth : '300px',
        maxWidth : '300px',
        bgcolor : (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
        ml : 2,
        borderRadius : '6px',
        height : 'fit-content',
        maxHeight : (theme) => `calc(${theme.trello.boardContentHeight} -${theme.spacing(5)})`
      }}
    >
      {/*Box Colums Header */}
      <Box sx = {{
        height: (theme) => theme.trello.columnHeaderHeight,
        p : 2,
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between'
      }}>
        <Typography variant='h6' sx ={{
          fontSize : '1rem',
          fontWeight : 'bold',
          cursor : 'pointer'
        }}>
          {column?.title}
        </Typography>
        <Box>
          <Tooltip title = "More options">
            <ExpandMoreIcon
              sx = {{ color : 'text.primary', cursor : 'pointer' }}
              id="basic-column-dropdown"
              aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            />
          </Tooltip>
          <Menu
            id="basic-menu-column-dropdown"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-column-dropdown'
            }}
          >
            <MenuItem>
              <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Add new card</ListItemText>
            </MenuItem>

            <MenuItem>
              <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>

            <MenuItem>
              <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
              <ListItemText>Paste</ListItemText>
            </MenuItem>

            <MenuItem>
              <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
              <ListItemText>Cut</ListItemText>
            </MenuItem>

            <Divider />
            <MenuItem>
              <ListItemIcon>< DeleteForeverIcon Cloud fontSize="small" /></ListItemIcon>
              <ListItemText>Remove this column </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
              <ListItemText>Archive this column </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      {/*List Card */}
      <ListCards cards = {orderedCards} />


      {/*Box Colums Footer */}
      <Box sx = {{
        height : (theme) => theme.trello.columnFooterHeight,
        p : 2,
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between'
      }}>
        <Button startIcon = {<AddCardIcon/>}>Add new card </Button>
        <Tooltip title = "Drap to move">
          <DragHandleIcon sx = {{ cursor : 'pointer' }} />
        </Tooltip>
      </Box>

    </Box>
  )
}

export default Column
