import React from 'react'
import './SelectableDeviceCard.css'

const SelectableDeviceCard = ({
  devices,
  locations,
  selectedIds,
  onSelectionChange
}) => {
  const toggle = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id)
      : [...selectedIds, id]
    onSelectionChange(next)
  }

  return (
    <div className="device-grid">
      {devices.map(device => {
        const isSelected = selectedIds.includes(device.id)
        const loc = locations.find(l => l.id === device.locationId)
        return (
          <div
            key={device.id}
            className={`device-card ${isSelected ? 'active' : ''}`}
            onClick={() => toggle(device.id)}>
            {loc && (
              <div className="device-location">
                <span className='device-location-name'>{loc.name}</span>
              </div>
            )}
            <div className="device-header">
              <div className="device-name">{device.name}</div>
              <div className="device-chip">{device.chipId}</div>
            </div>
            {device.description && (
              <div className="device-description">
                {device.description}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SelectableDeviceCard
