/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Snackbar, Alert } from '@mui/material'

type Severity = 'success' | 'info' | 'warning' | 'error'

interface NotifyOptions {
  message: string
  description?: string
  severity?: Severity
  duration?: number
}

const NotificationContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  show: (opts: NotifyOptions) => {
    console.log(opts)
  }
})

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifier = () => useContext(NotificationContext)

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<NotifyOptions>({
    message: '',
    severity: 'info',
    duration: 4000
  })

  const show = (opts: NotifyOptions) => {
    setOptions((prev) => ({ ...prev, ...opts }))
    setOpen(true)
  }

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={options.duration ?? 4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={options.severity ?? 'info'} sx={{ width: '100%' }}>
          <div style={{ fontWeight: 700 }}>{options.message}</div>
          {options.description && (
            <div style={{ fontSize: 13, opacity: 0.9 }}>{options.description}</div>
          )}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
