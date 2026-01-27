import React, { JSX, useEffect } from 'react'
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { Box } from '@mui/material'
import { appRoutes } from './routes/appRoutes'
import { IAppRoute } from './interface/config.interface'
import { NotificationProvider } from './components/core/NotificationProvider'
import { TitleBar } from './components/core/titlebar'
import { Sidebar } from './components/core/sidebar'
import { useConfigStore } from './store/configProvider'
import { TransactionAutoPrintProvider } from './context/TransactionAutoPrintContext'
import { IResponseLogin } from './interface/auth.interface'

const getToken = (): string | null => localStorage.getItem('token')

interface LoginOnlyLayoutProps {
  children: React.ReactNode
}

const LoginOnlyLayout = ({ children }: LoginOnlyLayoutProps): JSX.Element => {
  const token = getToken()
  const navigate = useNavigate()
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const { key, altKey, ctrlKey } = e

      if (key === 'F4' && altKey) e.preventDefault()
      if (key === 'F5') e.preventDefault()
      if (key === 'f' && altKey) e.preventDefault()
      if (key === 'F11') e.preventDefault()
      if (key === 'r' && ctrlKey) {
        e.preventDefault()
        window.location.reload()
      }
      if (key === 'i' && ctrlKey) {
        e.preventDefault()
        navigate('/xyz/info')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <TitleBar username="" showUpdateButton />
      </div>
      <main className="p-0 m-0 flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-900 overflow-auto">
        <div className="w-full h-full flex items-center justify-center">{children}</div>
      </main>
    </div>
  )
}

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps): JSX.Element => {
  const location = useLocation()
  const token = getToken()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

interface SidebarLayoutProps {
  children: React.ReactNode
}

const SidebarLayout = ({ children }: SidebarLayoutProps): JSX.Element => {
  const userLogin = localStorage.getItem('userLogin')
  const userData: IResponseLogin = userLogin ? JSON.parse(userLogin) : null
  const { assetsPathConfig } = useConfigStore()

  const handleLogout = (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('userLogin')
    window.location.reload()
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <TitleBar username={userData?.name || ''} onLogout={handleLogout} />

      <Sidebar logo={`${assetsPathConfig}\\images\\logo.png`} onLogout={handleLogout} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'grey.50',
          overflow: 'auto',
          mt: '40px'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

const SidebarLogLayout = ({ children }: SidebarLayoutProps): JSX.Element => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 3, overflow: 'auto' }}>{children}</Box>
    </Box>
  )
}

const renderRoute = (route: IAppRoute, key: number): JSX.Element => {
  const { element, protected: isProtected, path } = route

  if (!isProtected && (path === '/login' || path === '/xyz/info')) {
    return <Route key={key} path={path} element={<LoginOnlyLayout>{element}</LoginOnlyLayout>} />
  }

  if (!isProtected) {
    return <Route key={key} path={path} element={<SidebarLogLayout>{element}</SidebarLogLayout>} />
  }

  return (
    <Route
      key={key}
      path={path}
      element={
        <ProtectedLayout>
          <TransactionAutoPrintProvider>
            <SidebarLayout>{element}</SidebarLayout>
          </TransactionAutoPrintProvider>
        </ProtectedLayout>
      }
    />
  )
}

const App: React.FC = () => {
  const { fetchConfig, isLoading } = useConfigStore()

  useEffect(() => {
    fetchConfig()
  }, [])

  if (isLoading) return <p>Loading...</p>

  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {appRoutes.filter((r) => r.active).map((route, i) => renderRoute(route, i))}

          {/* 404 */}
          <Route
            path="*"
            element={
              <SidebarLayout>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box component="h1" sx={{ fontSize: '3rem', fontWeight: 700, mb: 1 }}>
                      404
                    </Box>
                    <Box component="p" sx={{ color: 'text.secondary' }}>
                      Page Not Found
                    </Box>
                  </Box>
                </Box>
              </SidebarLayout>
            }
          />
        </Routes>
      </Router>
    </NotificationProvider>
  )
}

export default App
