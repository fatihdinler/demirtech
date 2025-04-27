import { FaHome } from 'react-icons/fa'
import { MdAcUnit } from 'react-icons/md'
import {
  Dashboard,
  LocationsList,
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
    to: '/locations',
    icon: <MdAcUnit />,
    label: 'Lokasyonlar',
    isSidebarPage: true,
    element: <LocationsList />,
  },
]