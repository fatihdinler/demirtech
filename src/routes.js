import { FaHome } from "react-icons/fa"
import {
  Dashboard,
  DeviceDetail,
  ReportsList,
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
    to: '/reports',
    icon: <FaHome />,
    label: 'Raporlar',
    isSidebarPage: true,
    element: <ReportsList />,
  },
  {
    to: '/device-detail/:id',
    icon: null,
    label: null,
    isSidebarPage: false,
    element: <DeviceDetail />,
  },
]