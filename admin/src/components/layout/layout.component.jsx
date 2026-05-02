import { Outlet } from 'react-router-dom'
import { Sidebar, Navbar } from '../../components'
import useLayout from './layout.hook'

const Layout = () => {
  const { isSidebarOpen, toggleSidebar } = useLayout()

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <header className="h-16 shrink-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`shrink-0 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <Sidebar isSidebarOpen={isSidebarOpen} />
        </aside>
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
