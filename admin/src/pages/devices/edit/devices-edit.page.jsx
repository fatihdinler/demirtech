import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import Select from 'react-select'
import useDevicesEdit from './devices-edit.hook'

const DevicesEdit = () => {
  const {
    name,
    description,
    chipId,
    locationId,
    deviceType,
    deviceLocationType,
    measurementType,
    mqttTopic,
    onChange,
    locationsOptions,
    handleLocationsChange,
    clearPageHandler,
    editDevice,
    deviceTypesOptions,
    handleDeviceTypesChange,
    deviceLocationTypesOptions,
    handleDeviceLocationTypesChange,
    deviceMeasurementTypesOptions,
    handleDeviceMeasurementTypesChange,
    customersOptions,
    handleCustomersChange,
    branchesOptions,
    handleBranchesChange,
    customerId,
    branchId,
    isActive,
  } = useDevicesEdit()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Cihazlar', link: '/devices' },
          { label: 'Düzenle' }
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

        {/* Customer ve Branch seçimi */}
        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='deviceCustomer'>
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
            <Form.Group controlId='deviceBranch'>
              <Form.Label>Şube</Form.Label>
              <Select
                options={branchesOptions}
                value={branchesOptions ? branchesOptions.find(option => option.value === branchId) : null}
                onChange={handleBranchesChange}
                placeholder={!customerId ? 'Lütfen önce müşteri seçin' : 'Şube seçin'}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='deviceClimate'>
              <Form.Label>Klima</Form.Label>
              <Select
                options={locationsOptions}
                value={locationsOptions ? locationsOptions.find(option => option.value === locationId) : null}
                onChange={handleLocationsChange}
                placeholder={(!customerId || !branchId) ? 'Lütfen önce müşteri ve şube seçin' : 'Klima seçin'}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='deviceType'>
              <Form.Label>Cihaz Tipi</Form.Label>
              <Select
                options={deviceTypesOptions}
                value={deviceTypesOptions ? deviceTypesOptions.find(option => option.value === deviceType) : null}
                onChange={handleDeviceTypesChange}
                placeholder='Cihaz tipi seçin'
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
              <Form.Label>Cihaz Aktifliği</Form.Label>
              <Form.Check
                type='switch'
                id='custom-switch'
                label='Active'
                checked={isActive}  // isActive'in boolean değer olması gerekiyor
                onChange={(e) => onChange(e, 'isActive')}
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

        <Row className='mt-3'>
          <Col>
            <Form.Group controlId='deviceMqttTopic'>
              <Form.Label>MQTT Topic</Form.Label>
              <Form.Control
                type='text'
                value={mqttTopic}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <PageFooter
          createOrEditHandler={editDevice}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default DevicesEdit
