import ModeSelect from '../../components/ModeSelect'
import Box from '@mui/material/Box'

function AppBar() {
  return (
    <Box sx={{
      backgroundColor: 'primary.light',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      height: (theme) => theme.trello.appBarHeight
    }}>
      <ModeSelect />
    </Box>
  )
}

export default AppBar
