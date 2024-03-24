import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

function Card({temporaryHideMedia}) {
  if (temporaryHideMedia ) {
    return (
      <MuiCard sx={{
        cursor : 'pointer',
        boxShadow : '0 1px 1px rbga(0,0,0,0.2)',
        overflow : 'unset'
      }}>
        <CardContent sx ={{ p : 1.5, '&:last-child' :{ p : 1.5 } }} >
          <Typography >Card test 1</Typography>
        </CardContent>
      </MuiCard>
    )
  }

  return (
    <MuiCard sx={{
      cursor : 'pointer',
      boxShadow : '0 1px 1px rbga(0,0,0,0.2)',
      overflow : 'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://gcs.tripi.vn/public-tripi/tripi-feed/img/474089fXg/hinh-loc-phu-ho-hai-huoc_104647353.jpg"
        title="green iguana"
      />
      <CardContent sx ={{ p : 1.5, '&:last-child' :{ p : 1.5 } }} >
        <Typography >Nguyễn Minh Tân - Dev</Typography>
      </CardContent>
      <CardActions sx ={{ p : '0 4px 8px 4px' }} >
        <Button size="small" startIcon = {< GroupIcon/> } sx = {{ '&:hover': { bgcolor : '#ecf0f1' } }} >30</Button>
        <Button size="small" startIcon = {< CommentIcon/>} sx = {{ '&:hover': { bgcolor : '#ecf0f1' } }} >15</Button>
        <Button size="small" startIcon = {< AttachmentIcon/>} sx = {{ '&:hover': { bgcolor : '#ecf0f1' } }} >25</Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card
