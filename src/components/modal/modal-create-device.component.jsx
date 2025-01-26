import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setName,
  setDescription,
  setChipId,
  setMin,
  setMax,
  setTolerance,
  setMeasurementType,
  setModelName,
  setColor,
  clearPage,
} from '../../features/devices/devices-create.state'

const ModalCreateDevice = ({ setIsModalOpen }) => {
  const dispatch = useDispatch()

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
  } = useSelector((state) => state.devices.create)

  const handleSave = () => {
    const newDevice = {
      name,
      description,
      chipId,
      min,
      max,
      tolerance,
      measurementType,
      modelName,
      color,
    }

    console.log('Saved Device:', newDevice)
    dispatch(clearPage())
    dispatch(setIsModalOpen(false))
  }

  const handleClose = () => {
    dispatch(clearPage())
    dispatch(setIsModalOpen(false))
  }

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
              className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
              value={name || ''}
              onChange={(e) => dispatch(setName(e.target.value))}
            />
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Description</label>
            <input
              type='text'
              className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
              value={description || ''}
              onChange={(e) => dispatch(setDescription(e.target.value))}
            />
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Chip ID</label>
            <input
              type='text'
              className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
              value={chipId || ''}
              onChange={(e) => dispatch(setChipId(e.target.value))}
            />
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Cihaz Modeli</label>
            <select
              className='mt-1 w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:border-primary'
              value={modelName || ''}
              onChange={(e) => dispatch(setModelName(e.target.value))}>
              <option value='' disabled>
                Cihaz Modeli Seçiniz
              </option>
              <option value='DT-100'>DT-100</option>
              <option value='DT-200'>DT-200</option>
              <option value='DT-300'>DT-300</option>
            </select>
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Ölçüm Birimi</label>
            <select
              className='mt-1 w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:border-primary'
              value={measurementType || ''}
              onChange={(e) => dispatch(setMeasurementType(e.target.value))}
            >
              <option value='' disabled>
                Ölçüm Tipini Seçiniz
              </option>
              <option value='temperature'>Temperature</option>
              <option value='humidity'>Humidity</option>
              <option value='current'>Current</option>
            </select>
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Renk</label>
            <input
              type='color'
              className='mt-1 w-full cursor-pointer border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
              value={color || '#000000'}
              onChange={(e) => dispatch(setColor(e.target.value))}
            />
          </div>

          <div className='flex gap-2'>
            <div className='flex-1'>
              <label className='block text-sm text-gray-600'>Min</label>
              <input
                type='number'
                className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
                value={min || ''}
                onChange={(e) => dispatch(setMin(Number(e.target.value)))}
              />
            </div>

            <div className='flex-1'>
              <label className='block text-sm text-gray-600'>Max</label>
              <input
                type='number'
                className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
                value={max || ''}
                onChange={(e) => dispatch(setMax(Number(e.target.value)))}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm text-gray-600'>Tolerance</label>
            <input
              type='number'
              className='mt-1 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary'
              value={tolerance || ''}
              onChange={(e) => dispatch(setTolerance(Number(e.target.value)))}
            />
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
