import React from 'react'
import { Button, Spinner } from 'react-bootstrap'

const GetReportButton = ({ onClick, numberOfItems, isLoading }) => {
  return (
    <Button
      className='get-report-btn'
      onClick={onClick}
      disabled={isLoading}>
      {isLoading ? (
        <>
          <Spinner
            as='span'
            animation='border'
            size='sm'
            role='status'
            aria-hidden='true'
          />{' '}
          Rapor oluşturuluyor...
        </>
      ) : (
        <>Rapor Al ({numberOfItems})</>
      )}
    </Button>
  )
}

export default GetReportButton
