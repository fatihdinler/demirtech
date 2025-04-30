import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import useDevicesList from './devices-list.hook'
import { SelectableDeviceCard, ListPagesHeader, GetReportButton } from '../../components'
import moment from 'moment'
import 'moment/locale/tr'
moment.locale('tr')

const DevicesList = () => {
  const {
    devices,
    locations,
    isPageLoading,
    selectedDevices,
    startTime,
    endTime,
    setSelectedDevices,
    handleTimeApply,
    handleGetReport,
    isReportLoading,
  } = useDevicesList()

  return (
    <Container fluid>
      {isPageLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Row className='align-items-center mb-3 justify-content-center'>
            <Col className='px-3'>
              <ListPagesHeader
                breadcrumbItems={[{ label: 'Cihazlar', link: '/devices' }]}
              />
            </Col>

            <Col xs='auto'>
              <DateRangePicker
                startDate={startTime ? moment(startTime) : undefined}
                endDate={endTime ? moment(endTime) : undefined}
                onApply={handleTimeApply}
                showDropdowns
                timePicker
                timePicker24Hour
                locale={{
                  format: 'DD.MM.YYYY HH.mm',
                  separator: ' → ',
                  applyLabel: 'Uygula',
                  cancelLabel: 'İptal',
                }}>
                <Button variant='outline-secondary'>
                  {startTime && endTime
                    ? `${moment(startTime).format('DD.MM.YYYY HH.mm')} → ${moment(endTime).format('DD.MM.YYYY HH.mm')}`
                    : 'Tarih & Saat Aralığı Seçin'}
                </Button>
              </DateRangePicker>
            </Col>

            {selectedDevices.length > 0 && (
              <Col xs='auto'>
                <GetReportButton onClick={handleGetReport} numberOfItems={selectedDevices.length} isLoading={isReportLoading} />
              </Col>
            )}
          </Row>

          <SelectableDeviceCard
            devices={devices}
            locations={locations}
            selectedIds={selectedDevices}
            onSelectionChange={setSelectedDevices}
          />
        </>
      )}
    </Container>
  )
}

export default DevicesList
