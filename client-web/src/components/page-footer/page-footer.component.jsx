import { Row, Col, Button, } from 'react-bootstrap'

const PageFooter = ({ isCreatePage, createOrEditHandler, cancelHander }) => {
  return (
    <div className='page-footer'>
      <div className='dividor mt-4' />
      <Row className='d-flex mt-4'>
        <Col className='d-flex justify-content-end'>
          <Button className=' me-2' onClick={cancelHander} variant='outline-secondary'>
            İptal
          </Button>
          <Button className='' onClick={createOrEditHandler}>
            {isCreatePage ? 'Oluştur' : 'Düzenle'}
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default PageFooter