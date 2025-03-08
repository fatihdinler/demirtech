import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import Select from 'react-select'
import useDevicesCreate from './devices-create.hook'

const DevicesCreate = () => {
  const {
    name,
    description,
    chipId,
    climateId,
    deviceType,
    measurementType,
    onChange,
    climatesOptions,
    handleClimatesChange,
    clearPageHandler,
    createDevice,
    deviceTypesOptions,
    handleDeviceTypesChange,
    deviceMeasurementTypesOptions,
    handleDeviceMeasurementTypesChange,
    customersOptions,
    handleCustomersChange,
    branchesOptions,
    handleBranchesChange,
    customerId,
    branchId,
  } = useDevicesCreate()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Cihazlar', link: '/devices' },
          { label: 'Oluştur' }
        ]}
      />
      <div className='page-background'>
        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='deviceName'>
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type='text'
                placeholder='Cihaz adını girin'
                value={name}
                onChange={(e) => onChange(e, 'name')}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='deviceChipId'>
              <Form.Label>Chip ID</Form.Label>
              <Form.Control
                type='text'
                placeholder='Chip ID girin'
                value={chipId}
                onChange={(e) => onChange(e, 'chipId')}
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
                placeholder={!customerId ? 'Lütfen Önce Müşteri Seçin' : 'Şube Seçin'}
                isDisabled={!customerId}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='deviceClimate'>
              <Form.Label>Klima</Form.Label>
              <Select
                options={climatesOptions}
                value={climatesOptions ? climatesOptions.find(option => option.value === climateId) : null}
                onChange={handleClimatesChange}
                placeholder={(!customerId || !branchId) ? 'Lütfen Önce Müşteri ve Şube Seçin' : 'Klima Seçin'}
                isDisabled={!customerId || !branchId}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='deviceType'>
              <Form.Label>Donanım Tipi</Form.Label>
              <Select
                options={deviceTypesOptions}
                value={deviceTypesOptions ? deviceTypesOptions.find(option => option.value === deviceType) : null}
                onChange={handleDeviceTypesChange}
                placeholder='Donanım tipi seçin'
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={12}>
            <Form.Group controlId='deviceMeasurementType'>
              <Form.Label>Ölçüm Tipi</Form.Label>
              <Select
                options={deviceMeasurementTypesOptions}
                value={deviceMeasurementTypesOptions ? deviceMeasurementTypesOptions.find(option => option.value === measurementType) : null}
                onChange={handleDeviceMeasurementTypesChange}
                placeholder='Ölçüm tipi seçin'
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col>
            <Form.Group controlId='deviceDescription'>
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Cihaz açıklamasını girin'
                value={description}
                onChange={(e) => onChange(e, 'description')}
              />
            </Form.Group>
          </Col>
        </Row>

        <PageFooter
          isCreatePage
          createOrEditHandler={createDevice}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default DevicesCreate
