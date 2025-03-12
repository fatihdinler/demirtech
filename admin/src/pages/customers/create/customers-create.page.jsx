import React from 'react'
import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import useCustomersCreate from './customers-create.hook'

const CustomersCreate = () => {
  const {
    name,
    description,
    onChange,
    createCustomer,
    clearPageHandler,
  } = useCustomersCreate()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Müşteriler', link: '/customers' },
          { label: 'Oluştur' }
        ]}
      />
      <div className='page-background'>
        <Row className='mt-3 justify-content-center'>
          <Col >
            <Form>
              <Form.Group controlId='customerName'>
                <Form.Label>Ad</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Müşteri adını girin'
                  value={name}
                  onChange={(e) => onChange(e, 'name')}
                />
              </Form.Group>
              <Form.Group controlId='customerDescription' className='mt-3'>
                <Form.Label>Açıklama</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='Müşteri açıklamasını girin'
                  value={description}
                  onChange={(e) => onChange(e, 'description')}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <PageFooter
          isCreatePage
          createOrEditHandler={createCustomer}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default CustomersCreate
