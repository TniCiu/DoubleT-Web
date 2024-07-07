import React, { useState, useEffect, useRef } from 'react';
import { Modal, Box, Typography, Avatar, Divider, Button, IconButton, InputBase, Menu, MenuItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CreateIcon from '@mui/icons-material/Create';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReactMarkdown from 'react-markdown';
import CheckIcon from '@mui/icons-material/Check';
import MDEditor from '@uiw/react-md-editor';
import CloseIcon from '@mui/icons-material/Close';
import CardInformationRightPane from './CardInformationRightPane';
import { fetchInforUserBoardsAPI, addMemberToCardAPI, updateCardDetailsAPI, fetchUserInfoAPI,  } from '~/apis';
const modalStyle = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  overflow: 'auto',
};

const leftPaneStyle = {
  flex: 1,
  paddingRight: '16px',
  overflow: 'auto',
};

const CardInformation = ({ board, openCardInformation, onClose, card, handleUpdateCard }) => {
  const [description, setDescription] = useState(card ? card.attachments : '');
  const [isEditing, setIsEditing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [newComment, setNewComment] = useState('');
  const [members, setMembers] = useState(card ? card.members || [] : []);
  const [anchorEl, setAnchorEl] = useState(null);
  const [boardMembers, setBoardMembers] = useState([]);
  const [user, setUser] = useState(null);
  const [coverImage, setCoverImage] = useState(card ? card.cover : '');
  const fileInputRef = useRef(null);
  const [comments, setComments] = useState(card.comments || []);

  useEffect(() => {
    if (board) {
      fetchInforUserBoardsAPI(board._id)
        .then((res) => {
          if (res.board && Array.isArray(res.board.members)) {
            setBoardMembers(res.board.members);
          } else {
            console.error('Members array not found in response:', res);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch info member', error);
        });
    }
  }, [board]);

  useEffect(() => {
    const fetchUserData = async () => {
      const ownerIds = localStorage.getItem('ownerIds');
      if (ownerIds) {
        try {
          const userData = await fetchUserInfoAPI(ownerIds);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
  
    fetchUserData(); // Gọi hàm fetchUserData ngay sau khi định nghĩa để đảm bảo nó được gọi mỗi khi component được render lại
  }, []);

  useEffect(() => {
    const handleDragStart = (e) => {
      if (openCardInformation) {
        e.preventDefault();
      }
    };

    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, [openCardInformation]);

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };
  
  const handleTitleClick = () => {
    setIsEdit(true);
  };

  const handleTitleBlur = async () => {
    if (editedTitle !== card.title) {
      try {
        await updateCardDetailsAPI(card._id, { title: editedTitle });
        card.title = editedTitle; // Update local state
        handleUpdateCard(card); // Call the update function
      } catch (error) {
        console.error('Failed to update card title:', error);
      }
    }
    setIsEdit(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleTitleBlur();
    }
  };

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAddMemberClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMemberSelect = async (member) => {
    setAnchorEl(null);
    const isMember = members.some((m) => m._id === member._id);

    if (isMember) {
      try {
        await removeMemberFromCardAPI(card._id, member._id);
        setMembers((prevMembers) => prevMembers.filter((m) => m._id !== member._id));
        card.members = card.members.filter((m) => m._id !== member._id);
        handleUpdateCard(card); // Call the update function
      } catch (error) {
        console.error('Failed to remove member from card:', error);
      }
    } else {
      try {
        await addMemberToCardAPI(card._id, member._id);
        setMembers((prevMembers) => [...prevMembers, member]);
        card.members.push(member);
        handleUpdateCard(card); // Call the update function
      } catch (error) {
        console.error('Failed to add member to card:', error);
      }
    }
  };

  const handleCoverButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleCoverImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await updateCardDetailsAPI(card._id, { cover: reader.result });
          setCoverImage(reader.result);
          card.cover = reader.result; // Update local state
          handleUpdateCard(card); // Call the update function
        } catch (error) {
          console.error('Failed to update card cover:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = async () => {
    if (isEditing && description !== card.attachments) {
      try {
        await updateCardDetailsAPI(card._id, { attachments: description });
        card.attachments = description; // Update local state
        handleUpdateCard(card); // Call the update function
      } catch (error) {
        console.error('Failed to update card description:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const newActivity = {
        user: {
          id: user ? user.id : '',
          name: user ? user.username : '',
          avatar: user ? user.avatar : '',
        },
        content: newComment,
        timestamp: new Date().toISOString(),
      };
      try {
        const updatedComments = [...comments, newActivity];
        await updateCardDetailsAPI(card._id, { comments: updatedComments });
        card.comments = updatedComments; // Update local state
        setComments(updatedComments);
        setNewComment('');
        handleUpdateCard(card); // Call the update function
      } catch (error) {
        console.error('Failed to add comment to card:', error);
      }
    }
  };

  const handleCommentKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission behavior
      handleAddComment();
    }
  };

  return (
    <Modal open={openCardInformation} onClose={onClose}>
      <Box sx={{ ...modalStyle, overflow: 'hidden' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', color: 'red', top: 0, right: 0 }}>
          <CloseIcon />
        </IconButton>
        <Box sx={leftPaneStyle} style={{ maxHeight: 'calc(100vh - 96px)' }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            {coverImage && (
              <img src={coverImage} alt="Cover" style={{ width: '100%', height: '275px', borderRadius: '8px' }} />
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
            <CreditCardIcon style={{ marginRight: '15px', color: 'black' }} />
            {isEdit ? (
              <TextField
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyPress={handleKeyPress}
                autoFocus
                fullWidth
                size="small"
                variant="outlined"
              />
            ) : (
              <Typography variant="h6" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
                {card.title}
              </Typography>
            )}
          </Box>
          <Typography sx={{ flex: 1, mt: 2, color: '#0984e3' }}>
            Members
          </Typography>
          <Box sx={{ display: 'flex', mt: 1 }}>
            {members.map((member) => (
              <Avatar key={member._id} sx={{ width: 28, height: 28, mr: 1 }} src={member.avatar}>
                {members.some((m) => m._id === member._id) && (
                  <CheckIcon
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      borderRadius: '50%',
                      color: 'green',
                    }}
                  />
                )}
              </Avatar>
            ))}
            <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: '#ccc', cursor: 'pointer' }} onClick={handleAddMemberClick}>
              +
            </Avatar>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              {boardMembers.map((member) => (
                <MenuItem
                  key={member._id}
                  onClick={() => {
                    handleMemberSelect(member);
                  }}
                >
                  <ListItemIcon>
                    <Avatar src={member.avatar} sx={{ width: 28, height: 28 }} />
                  </ListItemIcon>
                  <ListItemText>{member.name}</ListItemText>
                  {members.some((m) => m._id === member._id) && (
                    <CheckIcon
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'white',
                        borderRadius: '50%',
                        color: 'green',
                      }}
                    />
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DescriptionOutlinedIcon style={{ marginRight: '8px' }} />
            <Typography variant="subtitle1">Description</Typography>
            <Button
              onClick={handleEditClick}
              size="small"
              style={{ textTransform: 'none', marginLeft: 'auto' }}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </Box>
          <Box sx={{ mb: 2 }}>
  {isEditing ? (
    <MDEditor value={description} onChange={handleDescriptionChange} height={200} />
  ) : (
    <ReactMarkdown
      components={{
        img: ({ node, ...props }) => (
          <img {...props} style={{ width: '100%', height: '100%' }} />
        ),
      }}
    >
      {description}
    </ReactMarkdown>
  )}
</Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTimeIcon style={{ marginRight: '15px', color: 'black' }} />
            <Typography>Activity</Typography>
          </Box>
          {comments.length > 0 && comments.map((comment, index) => (
            <Box sx={{ display: 'flex', mb: 2 }} key={index}>
              <Avatar src={comment.user.avatar} sx={{ width: 28, height: 28, mr: 1 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>{comment.user.name}</Typography>
                <Typography>{comment.content}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
                  {new Date(comment.timestamp).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            
                <Avatar
                  sx={{ width: 28, height: 28, mr: 1 }}
                  src={user ? user.avatar : ''}
                />
            
            <InputBase
              sx={{
                border: '1px solid #ccc',
                borderRadius: '15px',
                padding: '4px 8px',
                flex: 1,
              }}
              placeholder="Write a comment..."
              value={newComment}
              onChange={handleCommentChange}
              onKeyPress={handleCommentKeyPress}
            />
          </Box>
        </Box>
        <CardInformationRightPane handleCoverButtonClick={handleCoverButtonClick} />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleCoverImageChange}
          accept="image/*"
        />
      </Box>
    </Modal>
  );
};

export default CardInformation;
