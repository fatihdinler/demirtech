import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import PropTypes from 'prop-types';

function Card({ title, description, extraContent, onClick, hoverable = false }) {
  return (
    <BootstrapCard
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        border: 'none',
        borderRadius: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      }}
      className="modern-card mb-4"
      onMouseEnter={(e) => {
        if (hoverable && onClick) {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable && onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      <BootstrapCard.Body style={{ padding: '1.5rem' }}>
        <div className="mb-3">
          <BootstrapCard.Title
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '0.5rem',
            }}
          >
            {title}
          </BootstrapCard.Title>
          <BootstrapCard.Text
            style={{
              fontSize: '1rem',
              color: '#4b5563',
              lineHeight: 1.5,
            }}
          >
            {description}
          </BootstrapCard.Text>
        </div>
        {extraContent && (
          <div
            style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '0.75rem',
            }}
          >
            {extraContent}
          </div>
        )}
      </BootstrapCard.Body>
    </BootstrapCard>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  extraContent: PropTypes.node,
  onClick: PropTypes.func,
  hoverable: PropTypes.bool,
};

export default Card;
