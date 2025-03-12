import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import Select from 'react-select'
import useLocationsCreate from './locations-create.hook'

const LocationsCreate = () => {
  const {
    name,
    description,
    branchId,
    onChange,
    branchesOptions,
    handleBranchesChange,
    customerId,
    customersOptions,
    handleCustomersChange,
    clearPageHandler,
    createLocation,
  } = useLocationsCreate()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Lokasyonlar', link: '/locations' },
          { label: 'Oluştur' }
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
                placeholder='Lokasyon açıklamasını girin'
                value={description}
                onChange={(e) => onChange(e, 'description')}
              />
            </Form.Group>
          </Col>
        </Row>

        <PageFooter
          isCreatePage
          createOrEditHandler={createLocation}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default LocationsCreate
