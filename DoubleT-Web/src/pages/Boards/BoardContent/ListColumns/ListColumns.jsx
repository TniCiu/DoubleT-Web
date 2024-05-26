import {toast} from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'


function ListColumns({ board,columns, createNewColumn,createNewCard,selectedImage, deleteColumnDetails,updateColumnTitle

 }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = () =>{
    if(!newColumnTitle){
      console.log('Please enter Column Title')
      return 
    }

    const newColumnData = {
      title: newColumnTitle
    }
     createNewColumn(newColumnData)


    toggleOpenNewColumnForm()
    setNewColumnTitle('')

  }
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx = {{
      backgroundImage: selectedImage ? `url(${selectedImage})` : 'none',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
        width : '100%',
        height : '100%',
        display : 'flex',
        overflowX : 'auto',
        overflowY : 'hidden',
        '&::-webkit-scrollbar-track' : { m : 2 }
      }}>

        {columns?.map(column => <Column 
        board = {board}
        key ={column._id} column = {column} 
        createNewCard={createNewCard} 
        updateColumnTitle={updateColumnTitle}
        deleteColumnDetails = {deleteColumnDetails}
        />)}

        {/* Add new col */}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx = {{
            minWidth : '250px',
            maxWidth : '250px',
            mx : 2,
            borderRadius : '6px',
            height : 'fit-content',
            bgcolor : '#ffffff3d '
          }}>
            <Button startIcon = { <NoteAddIcon/>}
              sx = {{
                color : 'white',
                width : '100%',
                justifyContent : 'flex-start',
                pl : 2.5,
                py : 1
              }}
            >
              Add New Column
            </Button>
          </Box>
          : <Box sx={{
            minWidth:'250px',
            maxWidth:'250px',
            mx:2,
            p:1,
            borderRadius: '6px',
            height:'fit-content',
            bgcolor:'#ffffff3d',
            display:'flex',
            flexDirection:'column',
            gap:1
          }}>
            <TextField
            label="Enter card title..."
            type="text"
            size = "small"
            variant="outlined"
            autoFocus
            value={newColumnTitle }
            onChange={(e) => setNewColumnTitle(e.target.value)}
          
          sx ={{ 
            '& label': { color : 'white' },
            '& input': { color : 'white' },
            '& label.Mui-focused ' : { color : 'white' },
            '& .MuiOutlinedInput-root' : {
              '& fieldset' : { borderColor : 'white' },
              '&:hover fieldset' : { borderColor : 'white' },
              '&.Mui-focused fieldset' : { borderColor : 'white' }
            }
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap:1}}>
          <Button
            onClick={addNewColumn}
            variant = "contained" color="success" size="small"
            sx ={{
              boxShadow:'none',
              border: '0.5px solid',
              borderColor: (theme) => theme.palette.success.main,
              '&:hover': {bgcolor: (theme)=>theme.palette.success.main}
            }}
            >Add Column  </Button>
            <CloseIcon
              fontSize = "small"
              sx= {{ 
                color: 'white' , 
                cursor:'pointer',
              '&:hover': {color: (theme)=>theme.palette.warning.light}
              }}
              onClick={toggleOpenNewColumnForm }
              />
            </Box>
          </Box>
        } 
        
      </Box>
    </SortableContext>
  )
}

export default ListColumns
