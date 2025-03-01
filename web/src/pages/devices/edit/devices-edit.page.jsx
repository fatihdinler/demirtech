import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import Select from 'react-select'
import useDevicesEdit from './devices-edit.hook'

const DevicesEdit = () => {
  const {
    name,
    description,
    chipId,
    climateId,
    deviceType,
    deviceLocationType,
    measurementType,
    mqttTopic,
    onChange,
    climatesOptions,
    handleClimatesChange,
    clearPageHandler,
    editDevice,
    deviceTypesOptions,
    handleDeviceTypesChange,
    deviceLocationTypesOptions,
    handleDeviceLocationTypesChange,
    deviceMeasurementTypesOptions,
    handleDeviceMeasurementTypesChange,
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

        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='deviceClimate'>
              <Form.Label>Klima</Form.Label>
              <Select
                options={climatesOptions}
                value={climatesOptions ? climatesOptions.find(option => option.value === climateId) : null}
                onChange={handleClimatesChange}
                placeholder='Klima seçin'
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
          <Col md={6}>
            <Form.Group controlId='deviceLocationType'>
              <Form.Label>Cihaz Konum Tipi</Form.Label>
              <Select
                options={deviceLocationTypesOptions}
                value={deviceLocationTypesOptions ? deviceLocationTypesOptions.find(option => option.value === deviceLocationType) : null}
                onChange={handleDeviceLocationTypesChange}
                placeholder='Cihaz konum tipi seçin'
              />
            </Form.Group>
          </Col>
          <Col md={6}>
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
