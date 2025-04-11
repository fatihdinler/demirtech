import { FaHome } from 'react-icons/fa'
import {
  Dashboard,
  Login,
  VerifyEmail,
} from './pages'

export const routes = [
  {
    to: '/dashboard',
    icon: <FaHome />,
    label: 'Ana Sayfa',
    isSidebarPage: true,
    element: <Dashboard />,
  },
  // {
  //   to: '/login',
  //   icon: null,
  //   label: null,
  //   isSidebarPage: false,
  //   element: <Login />,
  // },
  // {
  //   to: '/verify-email',
  //   icon: null,
  //   label: null,
  //   isSidebarPage: false,
  //   element: <VerifyEmail />,
  // },
]