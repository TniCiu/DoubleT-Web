import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { teal, deepOrange, cyan, orange } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'


const theme = extendTheme({
  trello : {
    appBarHeight : '58px',
    boardBarHeight : '60px'
  },

  colorSchemes: {
    light: {
      palette: {
        primary : {
          main: '#f8a5c2'
        },
        secondary : deepOrange
      }
    },
    //Dark
    dark: {
      palette: {
        primary: {
           main: '#CAD3C8'
        },
        secondary: {
          main: '#95a5a6'
        }
      }
    }
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
            backgroundColor : '#dff9fb',
            borderRadius : '8px'
          },
          '*::-webkit-scrollbar-thumb:hover' : {
            backgroundColor : '#95afc0',
            cursor : 'pointer'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color : theme.palette.primary.main,
          fontSize : '0.885rem'
        })

      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            color : theme.palette.primary.main,
            fontSize : '0.885rem',
            '.MuiOutlinedInput-notchedOutline' : {
              borderColor : theme.palette.primary.light
            },
            '&:hover' : {
              '.MuiOutlinedInput-notchedOutline' : {
                borderColor : theme.palette.primary.main
              }
            },
            '& fieldset' : {
              borderWidth : '1px !important'
            }
          }
        }
      }
    }

  }

})

export default theme
