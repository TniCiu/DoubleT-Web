import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect'
import AppIcon from '@mui/icons-material/Apps'
import Diversity1Icon from '@mui/icons-material/Diversity1';
import Typography from '@mui/material/Typography';
import Workspace from './Menus/Workspace'
import Recent from './Menus/Recent'
import Templates from './Menus/Templates'
import Starred from './Menus/Starred'
import TextField from '@mui/material/TextField'
import Profiles from './Menus/Profiles'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

function AppBar(){
    return(
        <Box px={2} sx={{
            width:'100%',
            height:(theme)=>theme.DoubleT.appBarheight,
            display:'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{display: 'flex', alignItems:'center', gap: 2}}>
              <AppIcon sx={{ color:'primary.main'}}/>  
              <Box sx={{display: 'flex', alignItems:'center', gap: 0.5}}>
              <Diversity1Icon sx={{ color:'primary.main'}}/>
              <Typography variant="span" sx={{fontSize:'1.2rem', fontWeight:'bold' ,color:'primary.main'}}>
                Double-T</Typography>
              </Box>
              <Workspace/>
              <Recent/>
              <Starred/>
              <Templates/>

              <Button variant="outlined">Create</Button>
            </Box>


            <Box sx={{display: 'flex', alignItems:'center', gap: 2}}>
            <TextField id="outlined-search" label="Tìm Kiếm" type="search" size="small"/>
            <ModeSelect/>
            <Tooltip title="Thông Báo">
            <Badge color="secondary" variant="dot" sx={{cursor:'pointer'}} >
            <NotificationsNoneIcon/>
            </Badge>
            </Tooltip>

            <Tooltip title="Thông Tin">
            <HelpOutlineIcon sx={{cursor:'pointer'}}/>
            </Tooltip>
            
            <Profiles/>
            </Box>
          
          </Box>
    )
}

export default AppBar