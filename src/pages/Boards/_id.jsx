import { Container } from '@mui/material'
import AppBar from '~/components/AppBar'
import BoardBar from '~/pages/Boards/Boradbar'
import BoardContent from './BoardContent'

function Board(){
    return (
        <Container disableGutters maxWidth={false} sx={{height:'100vh', }}>
        <AppBar/>
        <BoardBar/>
        <BoardContent/>
        </Container>
    
      )
    }

export default Board