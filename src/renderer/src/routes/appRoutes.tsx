import { IAppRoute } from '@renderer/interface/config.interface'
import { LoginPage, CreateTransactionPage, ListTransactionPage } from '@renderer/pages'

export const appRoutes: IAppRoute[] = [
  // =============== PUBLIC ROUTES ===============
  { path: '/login', element: <LoginPage />, active: true, protected: false },

  // =============== PROTECTED ROUTES ===============
  {
    path: '/',
    element: <CreateTransactionPage />,
    active: true,
    protected: true,
    redirectTo: '/login'
  },
  {
    path: '/transactions/create',
    element: <CreateTransactionPage />,
    active: true,
    protected: true
  },
  {
    path: '/transactions/list',
    element: <ListTransactionPage />,
    active: true,
    protected: true
  }

  // { path: '*', element: <NotFoundPage />, active: true, protected: false }
]
