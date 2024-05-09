// BoardBar.jsx
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LockIcon from '@mui/icons-material/Lock';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { capitalizeFirstLetter } from '~/utils/formatters';

const MenuSlyte = {
  bgcolor: 'transparent',
  color: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.100'
  }
};

function BoardBar({ board, selectedImage, onFileChange }) {
  useEffect(() => {
    // You can do something when selectedImage changes
  }, [selectedImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      const imageUrl = event.target.result;
      onFileChange(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box
  px={2}
  sx={{
    width: '100%',
    height: (theme) => theme.trello.boardBarHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    overflowX: 'auto',
    bgcolor: (theme) =>
      theme.palette.mode === 'dark' ? '#34495e' : '#0984e3',
    borderBottom: '1px solid white',
    backgroundImage: `url(${selectedImage})` // Đảm bảo selectedImage được sử dụng làm backgroundImage ở đây
  }}
>
      <Box sx = {{ display : 'flex', alignItems : 'center', gap : 2 }}>
        <Tooltip title = {board?.description}>
        <Chip
          sx = {MenuSlyte}
          icon={<DashboardIcon />}
          label= {board?.title}
          clickable
        />
        </Tooltip>
        <Chip
          sx={MenuSlyte}
          icon={<LockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip sx={MenuSlyte} icon={<BoltIcon />} label="Automation" clickable />
        <Chip
          sx={MenuSlyte}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
        <Chip
          sx={MenuSlyte}
          icon={<AddToDriveIcon />}
          label="Change Background"
          clickable
          component="label"
          htmlFor="file-input"
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id="file-input"
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '5px',
            '& .MuiAvatar-root': {
              width: 45,
              height: 45,
              fontSize: 20,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          {/* Avatar List */}
        </AvatarGroup>
      </Box>
    </Box>
  );
}

export default BoardBar;
