import React from 'react'
import useDevicesList from './devices-list.hook'

const DevicesList = () => {
  const {
    devices,
  } = useDevicesList()
  console.log(devices)
  return (
    <div>DevicesList</div>
  )
}

export default DevicesList