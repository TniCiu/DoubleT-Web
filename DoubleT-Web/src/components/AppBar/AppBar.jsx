import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AppsIcon from '@mui/icons-material/Apps';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Thêm dòng này
import Workspaces from './Menus/Workspaces';
import Recent from './Menus/Recents';
import Starred from './Menus/Starred';
import Templates from './Menus/Templates';
import Profiles from './Menus/Profiles';
import ModeSelect from '~/components/ModeSelect/ModeSelect';
import InvitationList from '~/components/AppBar/Invitition/InvitationList';

const AppBar = ({ selectedImage }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const invitedUserId = localStorage.getItem('ownerIds');

  const handleCloseNotificationForm = () => {
    setShowNotificationForm(false);
  };

  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'white' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: 'white' }} />
          <a href="/boards" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>TniCiu</a>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search..."
          type="text"
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon
                  fontSize='small'
                  sx={{ color: searchValue ? 'white' : 'transparent', cursor: 'pointer' }}
                  onClick={() => setSearchValue('')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: 120,
            maxWidth: 200,
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused ': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }}
        />
        <ModeSelect />
        <Tooltip title="Notification">
          <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }} onClick={() => setShowNotificationForm(true)}>
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help" sx={{ cursor: 'pointer', color: 'white' }}>
          <HelpOutlineIcon />
        </Tooltip>
        <Profiles />
      </Box>
      {showNotificationForm && (
        <InvitationList invitedUserId={invitedUserId} handleCloseNotificationForm={handleCloseNotificationForm} />
      )}
    </Box>
  );
};

export default AppBar;
