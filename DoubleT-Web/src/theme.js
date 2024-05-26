import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { teal, deepOrange, cyan, orange } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import BoardContent from './pages/Boards/BoardContent/BoardContent'

const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

const theme = extendTheme({
  trello : {
    appBarHeight : APP_BAR_HEIGHT,
    boardBarHeight : BOARD_BAR_HEIGHT,
    boardContentHeight :BOARD_CONTENT_HEIGHT,
    columnHeaderHeight : COLUMN_HEADER_HEIGHT,
    columnFooterHeight : COLUMN_FOOTER_HEIGHT
  },

  colorSchemes: {
    // light: {
    //   palette: {
    //     primary : {
    //       main: '#2ecc71'
    //     },
    //     secondary : deepOrange
    //   }
    // },
    // //Dark
    // dark: {
    //   palette: {
    //     primary: {
    //        main: '#CAD3C8'
    //     },
    //     secondary: {
    //       main: '#95a5a6'
    //     }
    //   }
    // }
  },

  components: {
    MuiCssBaseline: {
      styleOverrides : {
        body : {
          '*::-webkit-scrollbar' : {
            width : '8px',
            Height : '8px'
          },
          '*::-webkit-scrollbar-thumb' : {
            backgroundColor : '#dcdde1',
            borderRadius : '8px'
          },
          '*::-webkit-scrollbar-thumb:hover' : {
            backgroundColor : 'white',
            cursor : 'pointer'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth : '0.5px'
          //'&:hover ' : { borderWidth : '0.5px' }

        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize : '0.885rem'
        })

      }
    },
    MuiTypography: {
      styleOverrides: {
        root:{
          '&.MuiTypography-body1': { fontSize : '0.885rem' }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({


          fontSize : '0.885rem',
          // '.MuiOutlinedInput-notchedOutline' : {
          //   borderColor : theme.palette.primary.light
          // },
          // '&:hover' : {
          //   '.MuiOutlinedInput-notchedOutline' : {
          //     borderColor : theme.palette.primary.main
          //   }
          // },
          '& fieldset' : {
            borderWidth : '0.5px !important'
          },
          '&:hover fieldset' : {
            borderWidth : '2px !important'
          },
          '&.Mui-focused fieldset' : {
            borderWidth : '1px !important'
          }

        })
      }
    }
  }

})

export default theme