import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import Select from 'react-select'
import useClimatesEdit from './climates-edit.hook'

const ClimatesEdit = () => {
  const {
    name,
    description,
    model,
    branchId,
    onChange,
    branchesOptions,
    handleBranchesChange,
    clearPageHandler,
    editClimate,
    climateModelsOptions,
    handleClimateModelsChange,
  } = useClimatesEdit()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Klimalar', link: '/climates' },
          { label: 'Düzenle' }
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
            <Form.Group controlId='climateModel'>
              <Form.Label>Model</Form.Label>
              <Select
                options={climateModelsOptions}
                value={climateModelsOptions.find(option => option.value === model)}
                onChange={handleClimateModelsChange}
                placeholder='Model seçin'
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col md={12}>
            <Form.Group controlId='climateBranch'>
              <Form.Label>Şube</Form.Label>
              <Select
                options={branchesOptions}
                value={branchesOptions.find(option => option.value === branchId)}
                onChange={handleBranchesChange}
                placeholder='Şube seçin'
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
          createOrEditHandler={editClimate}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default ClimatesEdit
