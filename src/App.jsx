import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

function ModeSelect() {
 
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const SelectedMode = event.target.value
    console.log(SelectedMode)
    setMode(SelectedMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Model"
        onChange={handleChange}
      >
        <MenuItem value='light'>
          <div style={{display : 'flex', alignItems : 'center', gap : '8px' }}>
            <LightModeIcon fontSize = 'small'/> Light
          </div>
        </MenuItem>
        <MenuItem value='dark'>
          <div style={{display : 'flex', alignItems : 'center', gap : '8px' }}>
            <DarkModeOutlinedIcon fontSize = 'small'/> Dark
          </div>
        </MenuItem>
        <MenuItem value='system'>
          <div style={{display : 'flex', alignItems : 'center', gap : '8px' }}>
            <SettingsBrightnessIcon fontSize = 'small'/> System
          </div>
        </MenuItem>
      </Select>
    </FormControl>
  )
}


function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}



function App() {
 
  

  return (
    <>
    <ModeSelect/>
    <hr/>
     <ModeToggle />
     <hr/>
      <div>MinhTan</div>
      <Typography variant= "body2" color = "text.secondary"> testtt </Typography>

      <Button variant='text'>Text</Button>
      <Button variant='contained'>Contained</Button>
      <Button variant='outlined'>Outlined</Button>
    </>
  )
}

export default App
