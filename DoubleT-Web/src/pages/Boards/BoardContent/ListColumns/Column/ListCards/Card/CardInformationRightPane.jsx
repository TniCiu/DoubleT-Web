import React from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LabelIcon from '@mui/icons-material/Label';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';

const rightPaneStyle = {
  width: '200px',
  display: 'flex',
  flexDirection: 'column',
};

const optionButtonStyle = {
  justifyContent: 'flex-start',
  marginBottom: '8px',
  marginLeft: '8px',
  color: '#333333',
  fontSize: '12.5px',
};

const CardInformationRightPane = ({ board, card, handleCoverButtonClick }) => {
  return (
    <Box sx={rightPaneStyle}>
      <Typography
        variant="h6"
        component="h3"
        sx={{
          color: '#0984e3',
          justifyContent: 'flex-start',
          marginBottom: '8px',
          marginLeft: '8px',
          fontSize: '0.875rem',
        }}
      >
        Add To Card
      </Typography>
      <Button sx={optionButtonStyle} startIcon={<GroupIcon />}>
        Join
      </Button>
      <Button sx={optionButtonStyle} startIcon={<AddPhotoAlternateIcon />} onClick={handleCoverButtonClick}>
        Cover
      </Button>
      <Button sx={optionButtonStyle} startIcon={<LabelIcon />}>
        Labels
      </Button>
      <Button sx={optionButtonStyle} startIcon={<ChecklistIcon />}>
        Checklist
      </Button>
      <Button startIcon={<AttachFileIcon />} fullWidth sx={optionButtonStyle}>
        Attachment
      </Button>
      <Divider sx={{ my: 2 }} />
      <Typography
        variant="h6"
        component="h3"
        sx={{
          color: '#0984e3',
          justifyContent: 'flex-start',
          marginBottom: '8px',
          marginLeft: '8px',
          fontSize: '0.875rem',
        }}
      >
        Power-Ups
      </Typography>
      <Button startIcon={<AspectRatioIcon />} fullWidth sx={optionButtonStyle}>
        Card Size
      </Button>
      <Button startIcon={<AddToDriveIcon />} fullWidth sx={optionButtonStyle}>
        Google Drive
      </Button>
      <Button fullWidth sx={optionButtonStyle}>
        + Add Power-Ups
      </Button>
      <Divider sx={{ my: 2 }} />
      <Typography
        variant="h6"
        component="h3"
        sx={{
          color: '#0984e3',
          justifyContent: 'flex-start',
          marginBottom: '8px',
          marginLeft: '8px',
          fontSize: '0.875rem',
        }}
      >
        Actions
      </Typography>
      <Button startIcon={<ContentCopyIcon />} fullWidth sx={optionButtonStyle}>
        Copy
      </Button>
      <Button startIcon={<AcUnitIcon />} fullWidth sx={optionButtonStyle}>
        Make Template
      </Button>
      <Button startIcon={<MoveToInboxIcon />} fullWidth sx={optionButtonStyle}>
        Archive
      </Button>
    </Box>
  );
};

export default CardInformationRightPane;
