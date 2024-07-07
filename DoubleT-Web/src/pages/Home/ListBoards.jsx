import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserBoardsAPI , createNewBoardAPI, updateBoardDetailsAPI,deleteBoardDetailsAPI } from '~/apis';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AppBar from '~/components/AppBar/AppBar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import { useTheme } from '@mui/material/styles';
import { Paper, TextField, Radio, FormControlLabel, Menu, MenuItem } from '@mui/material';
import './BoardList.css';
import { toast } from 'react-toastify';
import { useConfirm } from "material-ui-confirm";


function BoardList( ) {
  const [boards, setBoards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newBoardData, setNewBoardData] = useState({ title: '', description: '', type: 'public' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [menuVisible, setMenuVisible] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  const ownerIds = localStorage.getItem('ownerIds');
  
  useEffect(() => {
    fetchUserBoardsAPI(ownerIds).then(data => {
      // Lọc danh sách Boards dựa trên ownerIds và memberIds
      const filteredBoards = data.filter(board => {
        return board.ownerIds.includes(ownerIds) || board.memberIds.includes(ownerIds);
      });
      setBoards(filteredBoards);
    });
  }, []);

  const handleNavigate = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBoardData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === 'create') {
      // Thêm ownerIds vào dữ liệu mới của board
      const newBoardDataWithOwnerIds = { ...newBoardData, ownerIds: [ownerIds] };
      createNewBoardAPI(newBoardDataWithOwnerIds).then(() => {
        fetchUserBoardsAPI(ownerIds).then(data => {
          setBoards(data);
          setShowForm(false);
          toast.success("New board created successfully");
        });
      }).catch(error => {
        console.error('Error creating board:', error);
      });
    } else if (formMode === 'edit') {
      updateBoardDetailsAPI(selectedBoardId, newBoardData).then(() => {
        fetchUserBoardsAPI(ownerIds).then(data => {
          setBoards(data);
          setShowForm(false);
          toast.success("Board updated successfully");
        });
      }).catch(error => {
        console.error('Error updating board:', error);
      });
    }
  };
  
  const handleEditBoard = (boardId) => {
    setSelectedBoardId(boardId);
    const selectedBoard = boards.find(board => board._id === boardId);
    setNewBoardData(selectedBoard);
    setFormMode('edit');
    setShowForm(true);
    setAnchorEl(null); // Đóng menu khi bạn click vào nút "Edit"
    setMenuVisible(false);
  };

  const handleMenuOpen = (event, boardId) => {
    setSelectedBoardId(boardId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleShowForm = () => {
    setNewBoardData({ title: '', description: '', type: 'public' }); // Reset form data
    setFormMode('create'); // Reset form mode to 'create'
    setShowForm(true);
  };
  
  const confirmDeleteBoard = useConfirm();

  const handleConfirmDeleteBoard = (boardId) => {
    // Lưu trạng thái xác nhận vào biến cục bộ
    confirmDeleteBoard({
      title: 'Delete Board?',
      description: 'This action will permanently delete your Board! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
      confirmationButtonProps: { color: 'warning', variant: 'outlined' }
    }).then(() => {
      processDeleteBoard(boardId); // Truyền boardId vào hàm xóa
    }).catch(() => {
      // Xử lý nếu người dùng hủy xóa
      console.log('Delete board cancelled.');
    });
  };

  const processDeleteBoard = (boardId) => {
    deleteBoardDetailsAPI(boardId)
    .then(res => {
      toast.success(res?.deleteResult);
      const updatedBoards = boards.filter(board => board._id !== boardId);
      setBoards(updatedBoards);
    })
    .catch(error => {
      console.error('Error deleting board:', error);
      toast.error('An error occurred while deleting the board');
    });
  };

  return (
    <>
      <AppBar />
      <Container maxWidth="lg" >
        <Grid container spacing={3} >
          {/* Sidebar */}
          <Grid item xs={12} sm={3}>
            <List>
              <ListItem button component={Link} >
                <ListItemIcon>
                  <TrelloIcon style={{ fontSize: '20px', color: theme.palette.mode === 'dark' ? 'white' : 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Boards" />
              </ListItem>
              <ListItem button component={Link} >
                <ListItemIcon>
                  <DashboardOutlinedIcon style={{ fontSize: '20px', color: theme.palette.mode === 'dark' ? 'white' : 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Templates" />
              </ListItem>
              <ListItem button component={Link} to="/boards">
                <ListItemIcon>
                  <HomeIcon style={{ fontSize: '20px', color: theme.palette.mode === 'dark' ? 'white' : 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <Divider />
              <ListItem button onClick={handleShowForm}>
                <ListItemIcon>
                  <LibraryAddIcon style={{ fontSize: '20px', color: theme.palette.mode === 'dark' ? 'white' : 'black' }}/>
                </ListItemIcon>
                <ListItemText primary="Create a new Board" />
              </ListItem>
            </List>
          </Grid>
          {/* Board List */}
          <Grid item xs={12} sm={9} className="board-container">
            <Grid container spacing={3}>
              {boards.map(board => (
                <Grid item xs={12} sm={6} md={4} key={board._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {board.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {board.description}
                      </Typography>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button onClick={() => handleNavigate(board._id)} variant="contained" color="primary" sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' } }}>
                          Go to Board
                        </Button>
                        <Button onClick={(e) => handleMenuOpen(e, board._id)} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' } }}>
                          ...
                        </Button>
                      </div>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedBoardId === board._id}
                        onClose={handleMenuClose}
                        onClick={handleMenuClose}
                      >
                        {[
                          <MenuItem key="edit" className="add-card-icon" onClick={() => handleEditBoard(board._id) }
                          sx={{
                            '&:hover': {
                              color: 'success.light',
                              '& .add-card-icon': { color: 'success.light' }
                            }
                          }}>
                            <ListItemIcon>
                              <EditIcon fontSize="small" className="add-card-icon"/>
                            </ListItemIcon>
                            Edit this board
                          </MenuItem>,
                          
                          <MenuItem key="delete" className="delete" 
                          onClick={() => handleConfirmDeleteBoard(board._id)}
                            sx={{
                              '&:hover': {
                                color: 'warning.dark',
                                '& .delete': { color: 'warning.dark' }
                              }
                            }}>
                            <ListItemIcon>
                              <DeleteIcon fontSize="small"  className="delete"/>
                            </ListItemIcon>
                            Delete this board
                          </MenuItem>
                        ]}
                      </Menu>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {/* Form Overlay */}
      {showForm && (
        <div className="overlay">
          <Paper className="form-overlay" elevation={3}>
            <div className="close-icon" onClick={() => setShowForm(false)}>
              <CloseIcon style={{ color: 'red' }} />
            </div>
            <div className="title-container">
              <ListItemIcon>
                {formMode === 'create' ? (
                  <LibraryAddIcon style={{ fontSize: '20px', color: theme.palette.mode === 'dark' ? 'white' : 'black' }}/>
                ) : (
                  <EditIcon style={{ fontSize: '20px', color: theme.palette.mode === 'dark' ? 'white' : 'black' }}/>
                )}
              </ListItemIcon>
              <ListItemText primary={formMode === 'create' ? "Create a new Board" : "Edit Board"} />
            </div>
            <form onSubmit={handleSubmit} className="register-form">
              <TextField type="text" name="title" label="Title" value={newBoardData.title} onChange={handleChange} fullWidth required />
              <TextField type="text" name="description" label="Description" value={newBoardData.description} onChange={handleChange} fullWidth required />
              <div className="radio-buttons">
                <FormControlLabel control={<Radio name="type" value="public" checked={newBoardData.type === 'public'} onChange={handleChange} />} label="Public" />
                <FormControlLabel control={<Radio name="type" value="private" checked={newBoardData.type === 'private'} onChange={handleChange} />} label="Private" />
              </div>
              <Button type="submit" variant="contained" color="primary">{formMode === 'create' ? "Create" : "Save Changes"}</Button>
            </form>
          </Paper>
        </div>
      )}
    </>
  );
}

export default BoardList;
