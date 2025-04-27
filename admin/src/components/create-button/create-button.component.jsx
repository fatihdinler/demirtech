import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const CreateButton = ({ link }) => {
  const navigate = useNavigate()
  const navigationHandler = () => navigate(link)

  return (
    <div className=''>
      <Button
        style={{ backgroundColor: '#1976d2' }}
        className='primary-button mb-2'
        onClick={navigationHandler}>
        Oluştur
      </Button>
    </div>
  )
}

export default CreateButton