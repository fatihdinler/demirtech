import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { addDevice } from '../../features/devices/devices.api'

const useModalDeviceCreate = (setIsModalOpen) => {
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

  const [validationErrors, setValidationErrors] = useState({})

  const validateFields = () => {
    const errors = {}

    if (!name) errors.name = 'İsim alanı boş bırakılamaz!'
    if (!description) errors.description = 'Açıklama alanı boş bırakılamaz1'
    if (!chipId) errors.chipId = 'Chip ID alanı boş bırakılamaz!'
    if (!modelName) errors.modelName = 'Cihaz Modeli alanı boş bırakılamaz!'
    if (!measurementType) errors.measurementType = 'Ölçüm Tipi alanı boş bırakılamaz!'
    if (min === undefined || min === null || min === '') errors.min = 'Minimum Değer alanı boş bırakılamaz!'
    if (max === undefined || max === null || max === '') errors.max = 'Maksimum Değer alanı boş bırakılamaz!'
    if (tolerance === undefined || tolerance === null || tolerance === '') errors.tolerance = 'Tolerans alanı boş bırakılamaz!'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateFields()) return

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

    // ADD addDevice logic here!
    dispatch(clearPage())
    dispatch(setIsModalOpen(false))
  }

  const handleClose = () => {
    dispatch(clearPage())
    dispatch(setIsModalOpen(false))
  }

  return {
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
    setName: (value) => dispatch(setName(value)),
    setDescription: (value) => dispatch(setDescription(value)),
    setChipId: (value) => dispatch(setChipId(value)),
    setMin: (value) => dispatch(setMin(value)),
    setMax: (value) => dispatch(setMax(value)),
    setTolerance: (value) => dispatch(setTolerance(value)),
    setMeasurementType: (value) => dispatch(setMeasurementType(value)),
    setModelName: (value) => dispatch(setModelName(value)),
    setColor: (value) => dispatch(setColor(value)),
    handleSave,
    handleClose,
  }
}

export default useModalDeviceCreate
