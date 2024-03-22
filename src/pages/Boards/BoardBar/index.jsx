import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import LockIcon from '@mui/icons-material/Lock'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MenuSlyte = {
  // borderColor : 'white',
  bgcolor : 'transparent',
  color: 'white',
  border : 'none',
  paddingX : '5px',
  borderRadius : '4px',
  '& .MuiSvgIcon-root': {
    color : 'white'
  },
  '&:hover' : {
    bgcolor : 'primary.100'
  }
}

function BoardBar() {
  return (
    <Box px = {2} sx = {{
      width :'100%',
      height : (theme) => theme.trello.boardBarHeight,
      display : 'flex',
      alignItems : 'center',
      justifyContent : 'space-between',
      gap : 2,
      overflowX : 'auto',
      bgcolor : (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#0984e3' ),
      borderBottom : '1px solid white'
    }}>
      <Box sx = {{ display : 'flex', alignItems : 'center', gap : 2 }}>
        <Chip
          sx = {MenuSlyte}
          icon={<DashboardIcon />}
          label="NguyenMinhTan"
          clickable
        />
        <Chip
          sx = {MenuSlyte}
          icon={<LockIcon />}
          label="Public/Private WorkSpace"
          clickable
        />
        <Chip
          sx = {MenuSlyte}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx = {MenuSlyte}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx = {MenuSlyte}
          icon={<FilterListIcon/>}
          label="Filters"
          clickable
        />

      </Box>

      <Box sx = {{ display : 'flex', alignItems : 'center', gap : 2 }}>
        <Button
          variant="outlined"
          startIcon = {<PersonAddIcon/>}
          sx = {{
            color : 'white',
            borderColor : 'white',
            '&:hover' : { borderColor : 'white' }
          }}
        >Invite
        </Button>
        <AvatarGroup
          max={4}
          sx = {{
            gap : '5px',
            '& .MuiAvatar-root': {
              width : 45,
              height : 45,
              fontSize : 20,
              border : 'none',
              color : 'white',
              cursor : 'pointer',
              '&:first-of-type' : {bgcolor : '#a4b0be' }
            }
          }}
        >
          <Tooltip title = "NMinhTan">
            <Avatar alt="Remy Sharp" src="https://cdn.vietnambiz.vn/171464876016439296/2021/10/13/base64-16296211100371112704474-16341104497411050470508.png" />
          </Tooltip>
          <Tooltip title = "HTrongTin">
            <Avatar alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0asajXYpVYLFADJ2qlgNXJN2YwoOfg1_0SWMt0TwSWg&s" />
          </Tooltip>
          <Tooltip title = "ThienTri">
            <Avatar alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2s_riunj7zkz1-PszH0eIkKlA4KpmIaD0J-Lieq4_Ew&s" />
          </Tooltip>
          <Tooltip title = "HVinh">
            <Avatar alt="Remy Sharp" src="https://i1.sndcdn.com/artworks-000488664336-bn74bw-t500x500.jpg" />
          </Tooltip>
          <Tooltip title = "HVinh">
            <Avatar alt="Remy Sharp" src="https://i1.sndcdn.com/artworks-000488664336-bn74bw-t500x500.jpg" />
          </Tooltip>

        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar

