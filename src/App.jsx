import { AccessAlarm, ThreeDRotation } from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'

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
      <ModeToggle />
      <hr />
      <Typography variant="body2" color="text.secondary">Gia Lộc Dev</Typography>
      <AccessAlarm />
      <ThreeDRotation color="disabled" />
    </>
  )
}

export default App
