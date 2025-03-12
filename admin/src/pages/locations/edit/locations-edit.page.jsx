import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import Select from 'react-select'
import useLocationsEdit from './locations-edit.hook'

const LocationsEdit = () => {
  const {
    name,
    description,
    model,
    branchId,
    onChange,
    branchesOptions,
    handleBranchesChange,
    customerId,
    customersOptions,
    handleCustomersChange,
    clearPageHandler,
    editLocation,
  } = useLocationsEdit()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Lokasyonlar', link: '/locations' },
          { label: 'Düzenle' }
        ]}
      />

      <div className='page-background'>
        <Row className='mt-3'>
          <Col md={12}>
            <Form.Group controlId='locationName'>
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type='text'
                placeholder='Lokasyon adını girin'
                value={name}
                onChange={(e) => onChange(e, 'name')}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='locationCustomer'>
              <Form.Label>Müşteri</Form.Label>
              <Select
                options={customersOptions}
                value={customersOptions ? customersOptions.find(option => option.value === customerId) : null}
                onChange={handleCustomersChange}
                placeholder='Müşteri seçin'
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='locationBranch'>
              <Form.Label>Şube</Form.Label>
              <Select
                options={branchesOptions}
                value={branchesOptions ? branchesOptions.find(option => option.value === branchId) : null}
                onChange={handleBranchesChange}
                placeholder='Şube seçin'
                isDisabled={!customerId}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={12}>
            <Form.Group controlId='locationDescription'>
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Klima açıklamasını girin'
                value={description}
                onChange={(e) => onChange(e, 'description')}
              />
            </Form.Group>
          </Col>
        </Row>

        <PageFooter
          createOrEditHandler={editLocation}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default LocationsEdit
