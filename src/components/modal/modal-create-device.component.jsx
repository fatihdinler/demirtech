import React, { useState } from 'react'

function ModalCreateDevice({ setIsModalOpen, devices, setDevices }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#000000')
  const [minVal, setMinVal] = useState('')
  const [maxVal, setMaxVal] = useState('')
  const [tolerance, setTolerance] = useState('')

  const handleSave = () => {
    const newDevice = {
      name,
      description,
      color,
      min: minVal,
      max: maxVal,
      tolerance,
    }
    setDevices([...devices, newDevice])
    setIsModalOpen(false)
  }

  const handleClose = () => setIsModalOpen(false)

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Arka plan karartı */}
      <div
        className='absolute inset-0 bg-black/50'
        onClick={handleClose}
      ></div>

      {/* Modal kutusu */}
      <div
        className='
          relative bg-white rounded-md shadow-lg p-6 w-full max-w-md
        '
      >
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Yeni Device Ekle
        </h2>

        <div className='space-y-3'>
          <div>
            <label className='block text-sm text-gray-600'>Name</label>
            <input
              type='text'
              className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Description</label>
            <input
              type='text'
              className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Color</label>
            <input
              type='color'
              className='mt-1 w-full border border-gray-300 rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-primary'
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className='flex gap-2'>
            <div className='flex-1'>
              <label className='block text-sm text-gray-600'>Min</label>
              <input
                type='number'
                className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
                value={minVal}
                onChange={(e) => setMinVal(e.target.value)}
              />
            </div>

            <div className='flex-1'>
              <label className='block text-sm text-gray-600'>Max</label>
              <input
                type='number'
                className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
                value={maxVal}
                onChange={(e) => setMaxVal(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Tolerance</label>
            <input
              type='number'
              className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
            />
          </div>
        </div>

        <div className='flex justify-end mt-4 gap-2'>
          <button
            className='
              bg-gray-300 text-gray-700 py-2 px-4 rounded
              hover:bg-gray-400
            '
            onClick={handleClose}
          >
            İptal
          </button>
          <button
            className='
              bg-primary text-white py-2 px-4 rounded
              hover:bg-primary/90
            '
            onClick={handleSave}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalCreateDevice
