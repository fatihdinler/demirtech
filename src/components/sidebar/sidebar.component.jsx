import { FaChevronLeft, FaChevronRight, FaTabletAlt } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '../../routes'
import { ModalCreateDevice } from '../modal'
import useSidebar from './sidebar.hook'

const Sidebar = ({ devices, isSidebarOpen, toggleSidebar }) => {
  const { isModalOpen, setIsModalOpen, handleDeviceClick } = useSidebar()
  const location = useLocation()

  return (
    <aside
      className={`
        h-screen bg-gray-900 text-gray-100
        border-r border-gray-800 p-4
        flex flex-col transition-all duration-300
        ${isSidebarOpen ? 'w-64' : 'w-20'}
      `}
    >
      <div className='flex justify-end mb-6'>
        <button
          onClick={toggleSidebar}
          className='
            bg-gray-800 hover:bg-gray-700
            w-10 h-10 flex items-center justify-center
            text-gray-400 hover:text-gray-100
            rounded-full shadow transition-colors'
        >
          {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      <nav>
        {routes.map((route) => (
          route.isSidebarPage && (
            <Link
              key={route.to}
              to={route.to}
              className={`
                flex items-center gap-3 p-3 rounded-lg
                text-gray-400 hover:text-gray-100
                hover:bg-gray-800 transition-colors mb-2
                ${location.pathname === route.to ? 'bg-gray-800 text-gray-100' : ''}
              `}
            >
              <div className='text-xl'>{route.icon}</div>
              {isSidebarOpen && <span className='text-sm font-medium'>{route.label}</span>}
              {location.pathname === route.to && (
                <div className='w-2 h-2 rounded-full bg-green-500 ml-auto' />
              )}
            </Link>
          )
        ))}
      </nav>

      <div className='border-t border-gray-700 my-4'></div>

      {isSidebarOpen && (
        <h3 className='text-xs uppercase font-semibold text-gray-500 mb-4'>Cihazlar</h3>
      )}
      <div className='flex-1 overflow-auto'>
        {devices.map((device) => {
          const isActiveDevice = location.pathname === `/device-detail/${device.id}`
          return (
            <div
              key={device.id}
              onClick={() => handleDeviceClick(device.id)}
              className={`
                flex items-center gap-3 p-3 rounded-lg
                text-gray-400 hover:text-gray-100
                hover:bg-gray-800 transition-colors mb-2 cursor-pointer
                ${isActiveDevice ? 'bg-gray-800 text-gray-100' : ''}
              `}
            >
              <FaTabletAlt className='text-xl' />
              {isSidebarOpen && (
                <span className='text-sm font-medium'>{device.name}</span>
              )}
              {isActiveDevice && (
                <div className='w-2 h-2 rounded-full bg-green-500 ml-auto' />
              )}
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ModalCreateDevice
          setIsModalOpen={setIsModalOpen}
          devices={devices}
        />
      )}
    </aside>
  )
}

export default Sidebar
