import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { fetchUserInfoAPI, updateUserInfoAPI } from '~/apis/';
import { useConfirm } from "material-ui-confirm";
import { toast } from 'react-toastify';
import Compressor from 'compressorjs'
import UploadFileIcon from '@mui/icons-material/CloudUpload'

function Profiles() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const ownerIds = localStorage.getItem('ownerIds');
      if (ownerIds) {
        try {
          const userData = await fetchUserInfoAPI(ownerIds);
          setUser(userData);
          setUsername(userData.username);
          setEmail(userData.email);
          setAvatar(userData.avatar);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUpdate = async () => {
    try {
      const ownerIds = localStorage.getItem('ownerIds');
      const updatedData = {
        username,
        ...(password && { password }), // Include password if it's not empty
        ...(email && { email }), // Include email if it's not empty
        avatar: selectedImage || avatar // Update avatar with the new selected image or the current avatar
      };
      await updateUserInfoAPI(ownerIds, updatedData);
      setUser(updatedData);
      handleDialogClose();
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
      // Hiển thị toast thông báo lỗi
      toast.error('Failed to update profile.');
    }
  };
  

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6, // Set quality to 60%
        success(result) {
          resolve(result);
        },
        error(error) {
          reject(error);
        },
      });
    });
  };
  
  // Update handleImageChange function to compress the image before setting it
  // Update handleImageChange function to check the file size before compression
const handleImageChange = async (event) => {
  const file = event.target.files[0];
  // Kiểm tra kích thước của tệp (đơn vị: byte)
  const fileSizeInBytes = file.size;
  // Giới hạn kích thước tệp (vd: 5MB)
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (fileSizeInBytes > maxSizeInBytes) {
    // Hiển thị thông báo lỗi khi kích thước tệp vượt quá giới hạn
    console.error('File size exceeds the limit.');
    return;
  }

  try {
    const compressedImage = await compressImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result); // Update selectedImage to the compressed image URL
    };
    if (compressedImage) {
      reader.readAsDataURL(compressedImage);
    }
  } catch (error) {
    console.error('Error compressing image:', error);
    // Handle error
  }
};


  const confirmLogout = useConfirm();

  const handleLogout = () => {
    confirmLogout({
      title: 'Logout?',
      description: 'Are you sure you want to logout?',
      confirmationText: 'Logout',
      cancellationText: 'Cancel',
      confirmationButtonProps: { color: 'warning', variant: 'outlined' }
    }).then(() => {
      localStorage.removeItem('ownerIds');
      window.location.href = '/';
    }).catch(() => {
      console.log('Logout cancelled.');
    });
  };

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 40, height: 40 }}
            alt={user ? user.username : 'Loading...'}
            src={user ? user.avatar : ''}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'account-button'
        }}
      >
        <MenuItem onClick={handleDialogOpen}>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} src={user ? user.avatar : ''} /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>My Account</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Box display="flex" justifyContent="center">
              <input
                accept="image/jpeg, image/png" 
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file" 
                onChange={handleImageChange}
              />
              <label htmlFor="avatar-upload">
              <IconButton component="span" color="primary">
                <UploadFileIcon /> {/* Replace UploadFileIcon with your desired icon */}
              </IconButton>
              </label>  
            </Box>
            <Avatar src={selectedImage || avatar} sx={{ width: 80, height: 80, mb: 2 }} />
            <TextField
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              disabled
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profiles;
