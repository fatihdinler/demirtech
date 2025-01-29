import React from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineWarning } from 'react-icons/ai'
import { IoClose } from 'react-icons/io5'

const Toast = ({ type = 'success', message, onClose }) => {
  const toastStyles = {
    success: {
      icon: <AiOutlineCheckCircle className='w-6 h-6 text-green-500' />,
      bg: 'bg-green-50',
      text: 'text-green-800',
    },
    error: {
      icon: <AiOutlineCloseCircle className='w-6 h-6 text-red-500' />,
      bg: 'bg-red-50',
      text: 'text-red-800',
    },
    warning: {
      icon: <AiOutlineWarning className='w-6 h-6 text-yellow-500' />,
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
    },
  }

  const { icon, bg, text } = toastStyles[type] || toastStyles.success

  return (
    <div
      className={`${bg} ${text} flex items-center gap-4 p-4 rounded-lg shadow-lg transition-opacity duration-300 w-full max-w-sm mx-auto mb-4`}>
      {icon}
      <span className='flex-1 text-sm font-medium'>{message}</span>
      <button
        onClick={onClose}
        className='text-gray-400 hover:text-gray-700 transition-colors'>
        <IoClose className='w-5 h-5' />
      </button>
    </div>
  )
}

export default Toast
