import React from 'react'
import { useParams, useOutletContext } from 'react-router-dom'

const DeviceDetail = () => {
  const { id } = useParams()
  const [devices] = useOutletContext()

  const device = devices[id]

  if (!device) {
    return (
      <div className='text-red-500'>Device Bulunamadı!</div>
    )
  }

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-gray-800'>
        {device.name}
      </h1>
      <div className='p-4 bg-white border border-gray-200 rounded shadow-sm'>
        <p><strong>Description:</strong> {device.description}</p>
        <p><strong>Color:</strong> <span style={{ backgroundColor: device.color }} className='inline-block w-6 h-6 rounded-full border border-gray-300 ml-1' /></p>
        <p><strong>Min:</strong> {device.min}</p>
        <p><strong>Max:</strong> {device.max}</p>
        <p><strong>Tolerance:</strong> {device.tolerance}</p>
      </div>
    </div>
  )
}

export default DeviceDetail
