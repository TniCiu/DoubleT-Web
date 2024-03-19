import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { teal, deepOrange, cyan, orange } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'


const theme = extendTheme({
  trello : {
    appBarHeight : '58px',
    boardBarHeight : '60px'
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
          borderWidth : '0.5px',
          //'&:hover ' : { borderWidth : '0.5px' }

        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          // color : theme.palette.primary.main,
          fontSize : '0.885rem'
        })

      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({

          // color : theme.palette.primary.main,
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
