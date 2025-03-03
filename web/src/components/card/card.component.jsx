import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import PropTypes from 'prop-types';

function Card({ title, description, extraContent, onClick, hoverable = false }) {
  return (
    <BootstrapCard
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: 'none',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        background: '#ffffff'
      }}
      className="modern-card mb-4"
      onMouseEnter={(e) => {
        if (hoverable && onClick) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable && onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      <BootstrapCard.Body>
        <div className="mb-3">
          <BootstrapCard.Title
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1f2937',
            }}
          >
            {title}
          </BootstrapCard.Title>
          <BootstrapCard.Text
            style={{
              fontSize: '0.95rem',
              color: '#4b5563',
            }}
          >
            {description}
          </BootstrapCard.Text>
        </div>
        {extraContent && (
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
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
