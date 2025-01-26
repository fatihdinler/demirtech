import { useState } from 'react'

const useLayout = () => {
  const [devices, setDevices] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return {
    devices,
    setDevices,
    isSidebarOpen,
    toggleSidebar,
  }
}

export default useLayout