import { Outlet } from 'react-router-dom'
import { Navbar, Sidebar } from '../../components'
import useLayout from './layout.hook'

const Layout = () => {
  const {
    devices,
    isSidebarOpen,
    toggleSidebar,
  } = useLayout()

  return (
    <div className='min-h-screen flex bg-gray-50 text-textColor'>
      <Sidebar
        devices={devices}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className='flex-1 flex flex-col'>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className='p-4'>
          <Outlet context={[devices]} />
        </main>
      </div>
    </div>
  )
}

export default Layout
