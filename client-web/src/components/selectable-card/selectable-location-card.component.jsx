import React from 'react'
import './SelectableLocationCard.css'

const SelectableLocationCard = ({ locations, selectedIds, onSelectionChange }) => {
  const toggle = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id)
      : [...selectedIds, id]
    onSelectionChange(next)
  }

  return (
    <div className="location-grid">
      {locations.map(loc => {
        const isSelected = selectedIds.includes(loc.id)
        return (
          <div
            key={loc.id}
            className={`location-card ${isSelected ? 'active' : ''}`}
            onClick={() => toggle(loc.id)}
          >
            <div className="location-name">{loc.name}</div>
            {loc.description && (
              <div className="location-description">
                {loc.description}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SelectableLocationCard
