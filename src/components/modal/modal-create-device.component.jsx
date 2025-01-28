import React from 'react'
import useModalDeviceCreate from './modal-create-device.hook'

const ModalCreateDevice = ({ setIsModalOpen }) => {
  const {
    name,
    description,
    chipId,
    min,
    max,
    tolerance,
    measurementType,
    modelName,
    color,
    validationErrors,
    handleSave,
    handleClose,
    setName,
    setDescription,
    setChipId,
    setMin,
    setMax,
    setTolerance,
    setMeasurementType,
    setModelName,
    setColor,
  } = useModalDeviceCreate(setIsModalOpen)

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/50'
        onClick={handleClose}>
      </div>
      <div className='relative bg-white rounded-md shadow-lg p-6 w-full max-w-md'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Yeni Cihaz Ekle</h2>
        <div className='space-y-3'>
          <div>
            <label className='block text-sm text-gray-600'>Name</label>
            <input
              type='text'
              className={`mt-1 w-full border text-zinc-800 ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 focus:outline-none focus:border-primary`}
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
            />
            {validationErrors.name && <p className='text-red-500 text-sm'>{validationErrors.name}</p>}
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Description</label>
            <input
              type='text'
              className={`mt-1 w-full border text-zinc-800 ${validationErrors.description ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 focus:outline-none focus:border-primary`}
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
            />
            {validationErrors.description && <p className='text-red-500 text-sm'>{validationErrors.description}</p>}
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Chip ID</label>
            <input
              type='text'
              className={`mt-1 w-full border text-zinc-800 ${validationErrors.chipId ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 focus:outline-none focus:border-primary`}
              value={chipId || ''}
              onChange={(e) => setChipId(e.target.value)}
            />
            {validationErrors.chipId && <p className='text-red-500 text-sm'>{validationErrors.chipId}</p>}
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Cihaz Modeli</label>
            <select
              className={`mt-1 w-full border text-zinc-800 ${validationErrors.modelName ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-2 focus:outline-none focus:border-primary`}
              value={modelName || ''}
              onChange={(e) => setModelName(e.target.value)}>
              <option value='' disabled>
                Cihaz Modeli Seçiniz
              </option>
              <option value='DT-100'>DT-100</option>
              <option value='DT-200'>DT-200</option>
              <option value='DT-300'>DT-300</option>
            </select>
            {validationErrors.modelName && <p className='text-red-500 text-sm'>{validationErrors.modelName}</p>}
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Ölçüm Birimi</label>
            <select
              className={`mt-1 w-full border text-zinc-800 ${validationErrors.measurementType ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-2 focus:outline-none focus:border-primary`}
              value={measurementType || ''}
              onChange={(e) => setMeasurementType(e.target.value)}
            >
              <option value='' disabled>
                Ölçüm Tipini Seçiniz
              </option>
              <option value='temperature'>Temperature</option>
              <option value='humidity'>Humidity</option>
              <option value='current'>Current</option>
            </select>
            {validationErrors.measurementType && <p className='text-red-500 text-sm'>{validationErrors.measurementType}</p>}
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Renk</label>
            <input
              type='color'
              className='mt-1 w-full cursor-pointer border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
              value={color || '#000000'}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className='flex gap-2'>
            <div className='flex-1'>
              <label className='block text-sm text-gray-600'>Min</label>
              <input
                type='number'
                className={`mt-1 w-full border text-zinc-800 ${validationErrors.min ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 focus:outline-none focus:border-primary`}
                value={min || ''}
                onChange={(e) => setMin(Number(e.target.value))}
              />
              {validationErrors.min && <p className='text-red-500 text-sm'>{validationErrors.min}</p>}
            </div>
            <div className='flex-1'>
              <label className='block text-sm text-gray-600'>Max</label>
              <input
                type='number'
                className={`mt-1 w-full border text-zinc-800 ${validationErrors.max ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 focus:outline-none focus:border-primary`}
                value={max || ''}
                onChange={(e) => setMax(Number(e.target.value))}
              />
              {validationErrors.max && <p className='text-red-500 text-sm'>{validationErrors.max}</p>}
            </div>
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Tolerance</label>
            <input
              type='number'
              className={`mt-1 w-full border text-zinc-800 ${validationErrors.tolerance ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 focus:outline-none focus:border-primary`}
              value={tolerance || ''}
              onChange={(e) => setTolerance(Number(e.target.value))}
            />
            {validationErrors.tolerance && <p className='text-red-500 text-sm'>{validationErrors.tolerance}</p>}
          </div>
        </div>

        <div className='flex justify-end mt-4 gap-2'>
          <button
            className='bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400'
            onClick={handleClose}>
            İptal
          </button>
          <button
            className='bg-primary text-white py-2 px-4 rounded hover:bg-primary/90'
            onClick={handleSave}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalCreateDevice
