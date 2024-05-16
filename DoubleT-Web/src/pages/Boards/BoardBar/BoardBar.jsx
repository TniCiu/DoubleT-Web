import React, { useState, useEffect } from 'react';
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
import { sendInvitationAPI } from '~/apis';
import { styled } from '@mui/system';
import Modal from '@mui/material/Modal';
import Slide from '@mui/material/Slide';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const MenuStyle = {
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

// Styled Invite Button
const StyledInviteButton = styled(Button)({
  color: 'white',
  borderColor: 'white',
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  '& .MuiButton-startIcon': {
    marginRight: '8px',
  },
});

// Styled input
const StyledInput = styled('input')({
  width: '100%',
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
  transition: 'border-color 0.3s ease',
  '&:focus': {
    outline: 'none',
    borderColor: '#2980b9',
  },
});

function BoardBar({ board, selectedImage, onFileChange }) {
  const [invitedUserEmail, setInvitedUserEmail] = useState('');
  const [openModal, setOpenModal] = useState(false);

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

  const handleInvite = async () => {
    try {
      const boardId = board._id;
      const invitedBy = localStorage.getItem('ownerIds'); 
      // Pass an object containing both email and boardId
      const invitationData = {
          invitedUserEmail: invitedUserEmail,
          boardId: boardId,
          invitedBy: invitedBy
      };

      
      sendInvitationAPI(invitationData);
      toast.success('User invited successfully!');
      
      // Reset the email state and close the invite form
      setInvitedUserEmail('');
      handleCloseModal();
    } catch (error) {
      console.error('Failed to invite user:', error);
      // Handle error
      toast.error('Failed to invite user');
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2px',
        overflowX: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#0984e3',
        borderBottom: '1px solid white',
        backgroundImage: selectedImage ? `url(${selectedImage})` : 'none',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MenuStyle}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MenuStyle}
          icon={<LockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip sx={MenuStyle} icon={<BoltIcon />} label="Automation" clickable />
        <Chip
          sx={MenuStyle}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
        <Chip
          sx={MenuStyle}
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <AvatarGroup max={4} sx={{ gap: '5px' }}>
          {/* Avatar List */}
        </AvatarGroup>
        <StyledInviteButton
          variant="outlined"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenModal}
        >
          Invite
        </StyledInviteButton>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="invitation-modal-title"
          aria-describedby="invitation-modal-description"
          TransitionComponent={Slide}
          transitionDuration={500}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              width: '400px',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              position: 'relative'
            }}
          >
            <IconButton
              sx={{ position: 'absolute', top: '10px', right: '10px' }}
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </IconButton>
            <h2 id="invitation-modal-title">Invite User</h2>
            <StyledInput
              type="email"
              placeholder="Enter email"
              value={invitedUserEmail}
              onChange={(e) => setInvitedUserEmail(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleInvite}
              >
                Send 
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default BoardBar;
