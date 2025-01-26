import { FaBell, FaUserCircle } from 'react-icons/fa'
import DemirtekLogoSecondary from '../../assets/demirtek-logo-secondary.png'

const Navbar = () => {
  return (
    <nav className='h-16 bg-navbarBg flex items-center justify-between px-6 border-b border-gray-200'>
      <div className='flex-1'></div>

      <div className='absolute left-1/2 transform -translate-x-1/2'>
        <img
          src={DemirtekLogoSecondary}
          alt='Demirtek Logo Secondary'
          className='h-12 object-contain'
        />
      </div>

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
