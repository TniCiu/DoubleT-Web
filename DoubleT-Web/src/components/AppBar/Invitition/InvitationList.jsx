import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import Scrollbar from 'react-scrollbar'; // Import Scrollbar từ Material-UI
import { fetchInvitationsAPI, acceptInvitationAPI, declineInvitationAPI } from '~/apis';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

const InvitationList = ({ board,invitedUserId, handleCloseNotificationForm }) => {
  const [invitations, setInvitations] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true)
  const navigate = useNavigate();
  useEffect(() => {
    fetchInvitationsAPI(invitedUserId)

      .then((response) => {
        setInvitations(response || []);
        
      })
      .catch((error) => {
        console.error('Failed to fetch invitations', error);
      });
  }, [invitedUserId, updateTrigger]); // Thêm updateTrigger vào dependency array

  const handleAcceptInvitation = (invitation) => {
    acceptInvitationAPI(invitation._id)
      .then((response) => {
        console.log('Invitation accepted', response);
        setInvitations(invitations.filter(inv => inv._id !== invitation._id));
        navigate(`/boards/${invitation.boardId}`);
        handleFormClose();
      })
      .catch((error) => {
        console.error('Failed to accept invitation', error);
      });
  };

  const handleDeclineInvitation = (invitation) => {
    declineInvitationAPI(invitation._id)
      .then((response) => {
        console.log('Invitation declined', response);
        setInvitations(invitations.filter(inv => inv._id !== invitation._id));
        setUpdateTrigger(prevState => !prevState); // Trigger cập nhật lại form
      })
      .catch((error) => {
        console.error('Failed to decline invitation', error);
      });
  };
  const handleFormClose = () => {
    
    setIsFormOpen(false);
    handleCloseNotificationForm();
  };
  return (
    <>
     
        <Box
          sx={{
            position: 'absolute',
            top: '50px',
            right: '10px',
            bgcolor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            maxWidth: '300px',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Notifications</Typography>
          <Scrollbar style={{ maxHeight: '500px' }}>
            {invitations.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Typography variant="h6">No invitations</Typography>
            </Box>
            </Box>
            ) : (
              invitations.map((invitation, index) => (
                <Box key={invitation._id} sx={{ marginBottom: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    <Typography>
                      <span style={{ fontWeight: 'bold' }}>TniCiu</span> invited you to join the <span style={{ fontWeight: 'bold' }}>Board</span>.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', marginTop: '5px', alignItems: 'center' }}>
                    {invitation.status === 'accepted' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                        <CheckCircleIcon sx={{ color: 'green', marginRight: '5px' }} />
                        <Typography variant="subtitle2" sx={{ color: 'green' }}>Accepted</Typography>
                      </Box>
                    )}
                    {invitation.status === 'declined' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                        <CancelIcon sx={{ color: 'red', marginRight: '5px' }} />
                        <Typography variant="subtitle2" sx={{ color: 'red' }}>Declined</Typography>
                      </Box>
                    )}
                    {invitation.status !== 'accepted' && invitation.status !== 'declined' && (
                      <>
                        <Button onClick={(e) => { e.stopPropagation(); handleAcceptInvitation(invitation); }} variant="contained" color="success">Accept</Button>
                        <Button onClick={() => handleDeclineInvitation(invitation)} variant="contained" color="error">Decline</Button>
                      </>
                    )}
                  </Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#888', marginLeft: '50px', marginBottom: '20px', marginTop: '10px' }}>
                    {format(new Date(invitation.createdAt), 'eee, MMM dd, yyyy h:mm aa')}
                  </Typography>
                  {index !== invitations.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </Scrollbar>
          <CloseIcon
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              cursor: 'pointer',
              color: 'red',
            }}
            onClick={handleFormClose}
          />
        </Box>
    </>
  );
};

export default InvitationList;