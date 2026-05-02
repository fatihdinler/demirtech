import { useState, useRef, useEffect } from 'react'
import { FaBell, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import DemirtekLogoSecondary from '../../assets/demirtek-logo-secondary.png'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/auth.api'

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth.api)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const logoutFromApplication = () => {
    dispatch(logout())
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="h-full px-4 flex items-center justify-between">
      <button
        onClick={toggleSidebar}
        className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
      >
        {isSidebarOpen ? <FaChevronLeft size={14} /> : <FaChevronRight size={14} />}
      </button>

      <img
        src={DemirtekLogoSecondary}
        alt="Demirtek"
        className="absolute left-1/2 -translate-x-1/2 h-9 object-contain"
      />

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200">
          <FaBell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors duration-200"
          >
            <FaUserCircle size={26} className="text-slate-400" />
            <span className="hidden sm:block text-sm font-medium text-slate-700">
              {user?.name} {user?.surname}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fadeSlideIn">
              <button
                onClick={logoutFromApplication}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
              >
                <FaSignOutAlt size={14} className="text-red-400" />
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
