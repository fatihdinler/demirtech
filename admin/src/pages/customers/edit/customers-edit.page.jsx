import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import useCustomersEdit from './customers-edit.hook'

const CustomersEdit = () => {
  const {
    name,
    description,
    onChange,
    editCustomer,
    clearPageHandler,
  } = useCustomersEdit()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Müşteriler', link: '/customers' },
          { label: 'Düzenle' }
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
          createOrEditHandler={editCustomer}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default CustomersEdit