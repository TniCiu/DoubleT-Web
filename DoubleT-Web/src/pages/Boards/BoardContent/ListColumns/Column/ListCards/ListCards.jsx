import Box from '@mui/material/Box';
import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from './Card/Card';

function ListCards({ board, cards, openCardInformation, setOpenCardInformation }) {
  return (
    <SortableContext items={cards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
      <Box
        sx={{
          p: '0 5px 5px 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          borderRadius: '5px',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${theme.trello.columnHeaderHeight} - ${theme.trello.columnFooterHeight})`,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ced0da',
            borderRadius: '8px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#bfc2cf',
            cursor: 'pointer'
          }
        }}
      >
        {cards?.map(card => (
          <Card
            board={board}
            key={card._id}
            card={card}
            openCardInformation={openCardInformation}
            setOpenCardInformation={setOpenCardInformation}
          />
        ))}
      </Box>
    </SortableContext>
  );
}

export default ListCards;
