import { FaHome } from 'react-icons/fa'
import { MdAcUnit, MdDevices } from 'react-icons/md'
import Dashboard from './pages/dashboard/dashboard.page'
import LocationsList from './pages/locations/locations-list.page'
import DevicesList from './pages/devices/devices-list.page'

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
  {
    to: '/devices',
    icon: <MdDevices />,
    label: 'Cihazlar',
    isSidebarPage: true,
    element: <DevicesList />,
  },
]