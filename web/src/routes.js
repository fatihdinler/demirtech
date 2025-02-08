import { FaHome } from "react-icons/fa"
import {
  Dashboard,
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
]