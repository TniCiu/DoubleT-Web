import { experimental_extendTheme as extendTheme} from '@mui/material/styles'
import {  teal,deepOrange,cyan,orange } from '@mui/material/colors'
// Create a theme instance.
const theme = extendTheme({
  DoubleT:{
    appBarheight:'58px',
    boardBarheight:'60px',

  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
          secondary: deepOrange
    },
  },
  dark: {
    palette: {
      primary: cyan,
        secondary: orange
      
    },
  }
}
    // ...other properties
  });

export default theme;