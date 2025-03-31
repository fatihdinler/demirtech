import { FaHome } from 'react-icons/fa'
import {
  Dashboard,
  Login,
} from './pages'

export const routes = [
  {
    to: '/dashboard',
    icon: <FaHome />,
    label: 'Ana Sayfa',
    isSidebarPage: true,
    element: <Dashboard />,
  },
  {
    to: '/login',
    icon: null,
    label: null,
    isSidebarPage: false,
    element: <Login />,
  },
]