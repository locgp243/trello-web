import ModeSelect from '~/components/ModeSelect'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import Typography from '@mui/material/Typography'
import Workspace from './Menus/Workspace'
import Recent from './Menus/Recent'
import Templates from './Menus/Templates'
import Starred from './Menus/Starred'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import Button from '@mui/material/Button'

function AppBar() {
  return (
    <Box px={2} sx={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: (theme) => theme.trello.appBarHeight
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'primary.main' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={TrelloIcon} fontSize="small" inheritViewBox sx={{ color: 'primary.main' }} />
          <Typography
            variant='span'
            sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}
          >Trello
          </Typography>
        </Box>
        <Workspace />
        <Recent />
        <Starred />
        <Templates />
        <Button variant="outlined">Create</Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id="filled-search"
          label="Search..."
          type="search"
          size="small"
        />
        <ModeSelect />
        <Tooltip title="Notification">
          <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'primary.main' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'primary.main' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>

  )
}

export default AppBar
