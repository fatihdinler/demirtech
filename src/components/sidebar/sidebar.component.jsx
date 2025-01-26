import { FaTabletAlt, FaChevronLeft, FaChevronRight, FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { ModalCreateDevice } from '..'
import useSidebar from './sidebar.hook'

const Sidebar = ({ devices, isSidebarOpen, toggleSidebar }) => {
  const { isModalOpen, setIsModalOpen, handleDeviceClick } = useSidebar()

  return (
    <aside
      className={`
        h-screen
        bg-sidebarBg
        border-r border-gray-200
        p-4
        flex flex-col
        transition-all duration-300
        ${isSidebarOpen ? 'w-64' : 'w-16'}
      `}>
      <div className='flex justify-end mb-4'>
        <button
          onClick={toggleSidebar}
          className='
            bg-white border border-gray-300 rounded-full
            w-8 h-8 flex items-center justify-center
            text-gray-600 hover:text-primary
          '
        >
          {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      <div>
        <Link
          to="/dashboard"
          className={`w-full flex items-center justify-start gap-2 border-2 border-primary text-primary py-2 px-3 
            rounded-md shadow-sm hover:bg-primary hover:text-white transition-colors mb-3 ${!isSidebarOpen && 'justify-center'} `}>
          <FaHome />
          {isSidebarOpen && <span>Ana Sayfa</span>}
        </Link>

        <Link
          to='/reports'
          className={`
          w-full flex items-center justify-start gap-2 border-2 border-primary text-primary py-2 px-3 
            rounded-md shadow-sm hover:bg-primary hover:text-white transition-colors mb-3
            ${!isSidebarOpen && 'justify-center'}
          `} >
          <FaHome />
          {isSidebarOpen && <span>Raporlar</span>}
        </Link>
      </div>

      <div className='border-t border-gray-300 my-4'></div>
      {isSidebarOpen && (
        <h3 className='text-xs font-light text-gray-500 uppercase mb-2'>Cihazlar</h3>
      )}

      <div className='flex-1 overflow-auto'>
        {devices.map((device, index) => (
          <div
            key={index}
            className='
              flex items-center gap-2 p-2 mb-2
              cursor-pointer rounded-md hover:bg-gray-200
            '
            onClick={() => handleDeviceClick(index)}
          >
            <FaTabletAlt className='text-gray-500' />
            {isSidebarOpen && (
              <span className='text-sm text-gray-700'>{device.name}</span>
            )}
          </div>
        ))}
      </div>

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
