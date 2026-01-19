import React, { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Select,
  MenuItem,
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material'
import {
  Minimize,
  CropSquare,
  Close,
  Store,
  Settings,
  Logout,
  KeyboardArrowDown,
  Warning
} from '@mui/icons-material'
import { Update as UpdateIcon } from '@mui/icons-material'
import { IOutlet } from '@renderer/interface/outlet.interface'

interface TitleBarProps {
  title?: string
  username?: string
  theme?: 'light' | 'dark'
  onThemeToggle?: () => void
  onLogout?: () => void
  showUpdateButton?: boolean
}

export const TitleBar: React.FC<TitleBarProps> = ({
  username,
  theme = 'light',
  onLogout,
  showUpdateButton = false
}) => {
  // OUTLET LOGIC
  const [currentOutletId, setCurrentOutletId] = useState<IOutlet | null>(null)
  const [outlets, setOutlets] = useState<IOutlet[]>([])
  const [userEmail, setUserEmail] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('')
  const [openCloseDialog, setOpenCloseDialog] = useState(false)
  const [openedProgress, setOpenedProgress] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  // PROFILE MENU
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openProfileMenu = Boolean(anchorEl)

  // Snackbar untuk update info
  const [updateInfoOpen, setUpdateInfoOpen] = useState(false)
  const [updateInfoMsg, setUpdateInfoMsg] = useState('')
  const [updateInfoSeverity, setUpdateInfoSeverity] = useState<
    'info' | 'success' | 'warning' | 'error'
  >('info')

  React.useEffect(() => {
    try {
      const userStr = localStorage.getItem('userLogin')
      if (userStr) {
        const user = JSON.parse(userStr)
        setOutlets(user.outlets || [])
        setCurrentOutletId(user.currentOutlet || null)
        setUserEmail(user.email || '')
        setUserRole(user.role || 'User')
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeOutlet = (e: any): void => {
    const newId = e.target.value
    setCurrentOutletId(newId)
    try {
      const userStr = localStorage.getItem('userLogin')
      if (userStr) {
        const user = JSON.parse(userStr)
        const newOutlet = (user.outlets || []).find((o: IOutlet) => o.id === newId)
        if (newOutlet) {
          user.currentOutlet = newOutlet
          localStorage.setItem('userLogin', JSON.stringify(user))
          window.location.reload()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = (): void => {
    setAnchorEl(null)
  }

  const handleSettings = (): void => {
    handleProfileMenuClose()
    // Navigate to settings page
    console.log('Navigate to settings')
  }

  const handleLogout = (): void => {
    handleProfileMenuClose()
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('userLogin')
      window.location.href = '/login'
    }
  }

  useEffect(() => {
    const handleProgress = (_event: unknown, percent: number): void => {
      setDownloadProgress(percent)
      setOpenedProgress(true)
      if (percent >= 100) {
        setTimeout(() => setOpenedProgress(false), 2000)
      }
    }

    const handleUpdateNotification = (_event: unknown, msg: string, type: string): void => {
      setUpdateInfoMsg(msg)
      setUpdateInfoSeverity(type === 'latest' ? 'success' : 'info')
      setUpdateInfoOpen(true)
    }

    window.electron.ipcRenderer.on('update:download-progress', handleProgress)
    window.electron.ipcRenderer.on('update:notification', handleUpdateNotification)
    return () => {
      window.electron.ipcRenderer.removeAllListeners('update:download-progress')
      window.electron.ipcRenderer.removeAllListeners('update:notification')
    }
  }, [])

  // const handleCheckUpdates = (): void => {
  //   try {
  //     notifier.show({ message: 'Memeriksa pembaruan...', severity: 'info' })
  //     window.electron.ipcRenderer.send('check-for-updates')
  //   } catch (e) {
  //     console.error('Failed to request update check', e)
  //     notifier.show({ message: 'Gagal memeriksa pembaruan', severity: 'error' })
  //   }
  // }

  const handleMinimize = (): void => {
    window.electron?.ipcRenderer.send('window-minimize')
  }

  const handleMaximize = (): void => {
    window.electron?.ipcRenderer.send('window-maximize')
  }

  const handleCloseClick = (): void => {
    setOpenCloseDialog(true)
  }

  const handleCloseConfirm = (): void => {
    setOpenCloseDialog(false)
    window.electron?.ipcRenderer.send('window-close')
  }

  const handleCloseCancel = (): void => {
    setOpenCloseDialog(false)
  }

  // Get initials from username
  const getInitials = (name: string): string => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // const navigate = useNavigate()

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: 40,
          top: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#C3A86D',
          borderBottom: 1,
          borderColor: theme === 'dark' ? 'grey.800' : 'grey.300',
          WebkitAppRegion: 'drag'
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 40, px: 2 }}>
          {/* LEFT - Outlet Selector */}
          <Box display="flex" alignItems="center" gap={1}>
            {outlets.length > 0 && (
              <Select
                size="small"
                value={currentOutletId || ''}
                onChange={handleChangeOutlet}
                displayEmpty
                sx={{
                  minWidth: 160,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: 13,
                  height: 32,
                  '.MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.5
                  },
                  '.MuiSelect-icon': {
                    color: 'white'
                  },
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  WebkitAppRegion: 'no-drag'
                }}
                inputProps={{ 'aria-label': 'Select Outlet' }}
                renderValue={(selected) => {
                  const outlet = outlets.find((o) => o.id === selected.id)
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Store fontSize="small" />
                      <span>{outlet?.name || 'Pilih Outlet'}</span>
                    </Box>
                  )
                }}
              >
                {outlets.map((outlet) => (
                  <MenuItem key={outlet.id} value={outlet.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Store fontSize="small" />
                      <span>{outlet.name}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            )}
          </Box>

          {/* CENTER - Spacer */}
          <Box flex={1} />

          {/* RIGHT - User Profile & Window Controls */}
          <Box display="flex" alignItems="center" gap={1} sx={{ WebkitAppRegion: 'no-drag' }}>
            {/* Update button (optional) - shown when `showUpdateButton` is true */}
            {showUpdateButton && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<UpdateIcon />}
                onClick={() => {
                  window.electron.ipcRenderer.send('check-for-updates')
                }}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.18)',
                  minWidth: 36,
                  py: 0.5,
                  px: 1,
                  textTransform: 'none',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.28)' }
                }}
              >
                Update
              </Button>
            )}
            {/* User Profile Button */}
            {username && (
              <Box
                onClick={handleProfileMenuOpen}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)'
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.75rem',
                    bgcolor: 'white',
                    color: '#C3A86D',
                    fontWeight: 700
                  }}
                >
                  {getInitials(username)}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.8rem'
                  }}
                >
                  {username}
                </Typography>
                <KeyboardArrowDown sx={{ color: 'white', fontSize: 18 }} />
              </Box>
            )}

            {/* Window Control Buttons */}
            <Box display="flex" alignItems="center" sx={{ ml: 1 }}>
              <IconButton
                size="small"
                onClick={handleMinimize}
                sx={{
                  borderRadius: 0,
                  width: 36,
                  height: 36,
                  p: 0,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.12)'
                  }
                }}
                aria-label="Minimize"
              >
                <Minimize sx={{ color: 'white', fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleMaximize}
                sx={{
                  borderRadius: 0,
                  width: 36,
                  height: 36,
                  p: 0,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.12)'
                  }
                }}
                aria-label="Maximize"
              >
                <CropSquare sx={{ color: 'white', fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleCloseClick}
                sx={{
                  borderRadius: 0,
                  width: 36,
                  height: 36,
                  p: 0,
                  '&:hover': {
                    bgcolor: 'error.main'
                  }
                }}
                aria-label="Close"
              >
                <Close sx={{ color: 'white', fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={openProfileMenu}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 220,
            mt: 1,
            borderRadius: 2,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              sx={{
                bgcolor: '#C3A86D',
                color: 'white',
                fontWeight: 700
              }}
            >
              {getInitials(username || '')}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userEmail || userRole}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={openCloseDialog}
        onClose={handleCloseCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'warning.light',
                color: 'warning.main',
                width: 48,
                height: 48
              }}
            >
              <Warning />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Close Application?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Are you sure you want to exit?
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            All unsaved changes will be lost. Make sure you have saved your work before closing the
            application.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleCloseCancel}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: 'grey.300',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'grey.400',
                bgcolor: 'grey.50'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCloseConfirm}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
              minWidth: 120
            }}
          >
            Close App
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openedProgress}
        onClose={() => setOpenedProgress(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 340,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <UpdateIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Mengunduh Pembaruan...
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Update sedang diunduh...
          </Typography>
          <Box sx={{ width: '100%', mb: 1 }}>
            <LinearProgress variant="determinate" value={downloadProgress} />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {downloadProgress.toFixed(1)}%
          </Typography>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={updateInfoOpen}
        autoHideDuration={3500}
        onClose={() => setUpdateInfoOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setUpdateInfoOpen(false)}
          severity={updateInfoSeverity}
        >
          {updateInfoMsg}
        </MuiAlert>
      </Snackbar>
    </>
  )
}
