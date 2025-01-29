import React from 'react'
import { useParams, useOutletContext } from 'react-router-dom'

const DeviceDetail = () => {
  const { id } = useParams()

  return (
    <p>{id}</p>
  )
}

export default DeviceDetail
