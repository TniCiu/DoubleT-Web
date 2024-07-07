import React, { useState } from 'react';
import { Card as MuiCard, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardInformation from './CardInformation';

// Function to count number of attachments based on line breaks
const countAttachments = (attachments) => {
  return attachments ? attachments.trim().split('\n').filter(line => line.trim() !== '').length : 0;
};

function Card({ card, board, openCardInformation, setOpenCardInformation }) {
  const [openCardInformationLocal, setOpenCardInformationLocal] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: { ...card },
    disabled: openCardInformation || openCardInformationLocal,
  });

  const dndKitCardStyles = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition:'transform 0.2s ease-in-out',
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #81ecec' : undefined,
  };

  const shouldShowCardAction = () => {
    return !!card?.members?.length || !!card?.comments?.length || countAttachments(card?.attachments) > 0;
  };

  const handleClick = () => {
    if (typeof setOpenCardInformation === 'function') {
      setOpenCardInformation(true);
    }
    setOpenCardInformationLocal(true);
  };

  const handleClose = () => {
    if (typeof setOpenCardInformation === 'function') {
      setOpenCardInformation(false);
    }
    setOpenCardInformationLocal(false);
  };
  const handleUpdateCard = (updatedCard) => {
    // Update the card with new information
    Object.assign(card, updatedCard);
  };

  return (
    <>
      <MuiCard
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
          overflow: 'unset',
          display: card?.FE_PlaceholderCard ? 'none' : 'block',
        }}
        onClick={handleClick}
      >
        {card?.cover && (
          <CardMedia sx={{ height: 140 }} image={card?.cover} />
        )}
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>{card?.title}</Typography>
        </CardContent>
        {shouldShowCardAction() && (
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {!!card?.members?.length && (
              <Button size="small" startIcon={<GroupIcon />} sx={{ '&:hover': { bgcolor: '#ecf0f1' } }}>
                {card?.members?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button size="small" startIcon={<CommentIcon />} sx={{ '&:hover': { bgcolor: '#ecf0f1' } }}>
                {card?.comments?.length}
              </Button>
            )}
            {countAttachments(card?.attachments) > 0 && (
              <Button size="small" startIcon={<AttachmentIcon />} sx={{ '&:hover': { bgcolor: '#ecf0f1' } }}>
                {countAttachments(card?.attachments)}
              </Button>
            )}
          </CardActions>
        )}
      </MuiCard>
      <CardInformation card={card} board={board} handleUpdateCard={handleUpdateCard} openCardInformation={openCardInformationLocal} onClose={handleClose} />
    </>
  );
}

export default Card;
