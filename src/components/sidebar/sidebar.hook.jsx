import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const useSidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleDeviceClick = (index) => {
    navigate(`/device/${index}`)
  }
  return {
    isModalOpen,
    setIsModalOpen,
    handleDeviceClick,
  }
}

export default useSidebar