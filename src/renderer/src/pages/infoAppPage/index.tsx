import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Button, Stack, LinearProgress, Divider } from '@mui/material'
import { Update as UpdateIcon } from '@mui/icons-material'
import { appVersion } from '@renderer/utils/versionApp'
import { useNavigate } from 'react-router-dom'

export const InfoAppPage: React.FC = () => {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [, setOpenedProgress] = useState(false)
  const [, setDownloadProgress] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault()
        navigate('/')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate])

  useEffect(() => {
    const handleProgress = (_event: unknown, percent: number): void => {
      setDownloadProgress(percent)
      setOpenedProgress(true)
      if (percent >= 100) {
        setTimeout(() => setOpenedProgress(false), 2000)
      }
    }

    window.electron.ipcRenderer.on('update:download-progress', handleProgress)
    return () => {
      window.electron.ipcRenderer.removeAllListeners('update:download-progress')
    }
  }, [])

  // const isUpdateAvailable = appVersion !== latestVersion

  const checkForUpdates = async (): Promise<void> => {
    setChecking(true)
    window.electron.ipcRenderer.send('check-for-updates')
    setChecking(false)
  }

  const handleUpdate = async (): Promise<void> => {
    setUpdating(true)
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((r) => setTimeout(r, 300))
      setProgress(i)
    }
    setUpdating(false)
    alert('Update downloaded. App will restart.')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: 10,
        bgcolor: '#f5f5f5'
      }}
    >
      <Typography variant="h5" color="black" fontWeight={700} mb={2}>
        Application Info
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          {/* App Name */}
          <Box>
            <Typography fontWeight={600}>Samta Desktop</Typography>
            <Typography variant="caption" color="text.secondary">
              Desktop System Samta
            </Typography>
          </Box>

          <Divider />

          {/* Versions */}
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="caption" color="text.secondary">
                Current Version
              </Typography>
              <Typography fontWeight={600}>v{appVersion}</Typography>
            </Box>

            <Box textAlign="right">
              <Typography variant="caption" color="text.secondary">
                Latest Version
              </Typography>
              {/* <Typography fontWeight={600} color={isUpdateAvailable ? 'primary' : 'text.primary'}>
                v{latestVersion}
              </Typography> */}
            </Box>
          </Stack>

          {/* Update Info */}
          {/* {isUpdateAvailable && (
            <Alert severity="info">
              New version available - v{releaseNotes.version} ({releaseNotes.date})
            </Alert>
          )} */}

          {/* <Paper
            variant="outlined"
            sx={{
              mt: 1,
              bgcolor: isUpdateAvailable ? 'primary.50' : 'background.default'
            }}
          >
            <Box
              sx={{
                p: 2,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onClick={() => setShowReleaseNotes(!showReleaseNotes)}
            >
              <Typography fontWeight={600}>
                {isUpdateAvailable ? `Update v${releaseNotes.version} Features` : 'Release Notes'}
              </Typography>
              {showReleaseNotes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            <Collapse in={showReleaseNotes}>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Release date: {releaseNotes.date}
                </Typography>

                <List dense sx={{ py: 0 }}>
                  {releaseNotes.features.map((feature, index) => (
                    <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                      <ListItemText
                        primary={<Typography variant="body2">• {feature.text}</Typography>}
                        secondary={
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                            {feature.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="subtitle2" fontWeight={600} mt={3} mb={1}>
                  Previous Versions
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {releaseNotes.previousVersions.map((version, index) => (
                    <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            v{version.version} ({version.date})
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {version.highlights.join(', ')}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          </Paper> */}

          {updating && (
            <Box>
              <Typography variant="caption">Updating... {progress}%</Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<UpdateIcon />}
              // disabled={!isUpdateAvailable || updating}
              onClick={handleUpdate}
            >
              Update Now
            </Button>

            <Button fullWidth variant="outlined" disabled={checking} onClick={checkForUpdates}>
              {checking ? 'Checking...' : 'Check Updates'}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Support */}
      <Paper sx={{ p: 2, mt: 3, borderRadius: 2 }}>
        <Typography variant="body2" fontWeight={600} mb={1}>
          Support
        </Typography>
        <Typography variant="caption" color="text.secondary">
          support@samta.cloud • www.samta.cloud
        </Typography>
      </Paper>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mt: 3, textAlign: 'center' }}
      >
        © 2026 Samta
      </Typography>
    </Box>
  )
}
