import React from 'react'
import { Card as BootstrapCard } from 'react-bootstrap'

function Card({ title, value, icon, children }) {
  return (
    <BootstrapCard
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}
      className='mb-4'
    >
      <BootstrapCard.Body>
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <BootstrapCard.Title
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: 0
            }}
          >
            {title}
          </BootstrapCard.Title>
          {icon && <div>{icon}</div>}
        </div>
        {value && (
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '0.5rem'
            }}
          >
            {value}
          </div>
        )}
        {children && <div>{children}</div>}
      </BootstrapCard.Body>
    </BootstrapCard>
  )
}

export default Card
