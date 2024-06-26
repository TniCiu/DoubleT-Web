import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'

function Profiles(){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl)
    const handleClick = (event)  => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return(
        <Box>
           
            <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ padding:0 }}
            aria-controls={open ? 'basic-menu-Profiles' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
             <Avatar 
                sx={{ width: 30, height: 30 }}

                src="https://th.bing.com/th/id/R.61fa218ddf1d634369473fc4fd83d302?rik=4c494N%2foX4Gtkw&pid=ImgRaw&r=0"
            />
          </IconButton>
        </Tooltip>
            <Menu
            id="basic-menu-Profiles"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button-Profiles'
            }}
        >
           <MenuItem >
          <Avatar sx={{width: 28, height:28,mr:2}}/> Profile
        </MenuItem>
        <MenuItem >
          <Avatar sx={{width: 28, height:28,mr:2}}/> My account
        </MenuItem>
        <Divider />
        <MenuItem >
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
            </Menu>     
        </Box>

    )
}

export default Profiles