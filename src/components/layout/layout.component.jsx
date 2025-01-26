import { Outlet } from 'react-router-dom'
import { Navbar, Sidebar } from '../../components'
import useLayout from './layout.hook'

const Layout = () => {
  const {
    devices,
    isSidebarOpen,
    setDevices,
    toggleSidebar,
  } = useLayout()

  return (
    <div className='min-h-screen flex bg-gray-50 text-textColor'>
      <Sidebar
        devices={devices}
        setDevices={setDevices}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className='flex-1 flex flex-col'>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className='p-4'>
          <Outlet context={[devices, setDevices]} />
        </main>
      </div>
    </div>
  )
}

export default Layout
