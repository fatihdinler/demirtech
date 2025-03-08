import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import Select from 'react-select'
import useClimatesCreate from './climates-create.hook'

const ClimatesCreate = () => {
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
    createClimate,
    climateModelsOptions,
    handleClimateModelsChange,
  } = useClimatesCreate()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Klimalar', link: '/climates' },
          { label: 'Oluştur' }
        ]}
      />
      <div className='page-background'>
        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='climateName'>
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type='text'
                placeholder='Klima adını girin'
                value={name}
                onChange={(e) => onChange(e, 'name')}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='climateBranch'>
              <Form.Label>Model</Form.Label>
              <Select
                options={climateModelsOptions}
                value={climateModelsOptions ? climateModelsOptions.find(option => option.value === model) : null}
                onChange={handleClimateModelsChange}
                placeholder='Model seçin'
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='climateBranch'>
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
            <Form.Group controlId='climateBranch'>
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
            <Form.Group controlId='climateDescription'>
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
          isCreatePage
          createOrEditHandler={createClimate}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default ClimatesCreate
