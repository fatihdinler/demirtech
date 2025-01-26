import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setIsSidebarOpen } from '../../features/sidebar/sidebar.state'

const useLayout = () => {
  const dispatch = useDispatch()
  const [devices, setDevices] = useState([])
  const { isSidebarOpen } = useSelector(state => state.sidebar)

  const toggleSidebar = () => {
    dispatch(setIsSidebarOpen(!isSidebarOpen))
  }

  return {
    devices,
    setDevices,
    isSidebarOpen,
    toggleSidebar,
  }
}

export default useLayout