import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa'

function Navbar({ toggleSidebar }) {
  return (
    <nav className='h-16 bg-navbarBg flex items-center justify-between px-4 border-b border-gray-200'>
      {/* Solda hamburger butonu (opsiyonel) */}
      <div className='flex items-center space-x-2'>
        <button
          className='text-gray-600 hover:text-primary md:hidden'
          onClick={toggleSidebar}
        >
          <FaBars size={24} />
        </button>
        <span className='hidden md:block text-xl font-bold text-primary'>
          DemirTech
        </span>
      </div>

      {/* Sağda bildirim, profil vs. */}
      <div className='flex items-center space-x-4'>
        <button className='relative text-gray-600 hover:text-primary'>
          <FaBell size={20} />
          <span className='absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'>
            3
          </span>
        </button>
        <div className='flex items-center text-gray-600 hover:text-primary'>
          <FaUserCircle size={24} />
          <span className='ml-1 hidden sm:inline-block'>John Doe</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
