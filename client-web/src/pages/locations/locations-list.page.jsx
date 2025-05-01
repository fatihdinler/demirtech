// pages/locations-list/locations-list.page.jsx

import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import useLocationsList from './locations-list.hook'
import { ListPagesHeader, GetReportButton, SelectableLocationCard } from '../../components'
import moment from 'moment'
import 'moment/locale/tr'
moment.locale('tr')

const LocationsList = () => {
  const {
    locations,
    isPageLoading,
    selectedLocations,
    startTime,
    endTime,
    onSelectionChange,
    handleTimeApply,
    handleGetReport,
    isReportLoading
  } = useLocationsList()

  return (
    <Container fluid>
      {isPageLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Row className='align-items-center mb-3 justify-content-center'>
            <Col className='px-3'>
              <ListPagesHeader
                breadcrumbItems={[{ label: 'Lokasyonlar', link: '/locations' }]}
              />
            </Col>

            <Col xs='auto'>
              <DateRangePicker
                startDate={startTime ? moment(startTime) : undefined}
                endDate={endTime ? moment(endTime) : undefined}
                onApply={handleTimeApply}
                showDropdowns timePicker timePicker24Hour
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

            {selectedLocations.length > 0 && (
              <Col xs='auto'>
                <GetReportButton
                  onClick={handleGetReport}
                  numberOfItems={selectedLocations.length}
                  isLoading={isReportLoading}
                />
              </Col>
            )}
          </Row>

          <SelectableLocationCard
            locations={locations}
            selectedIds={selectedLocations}
            onSelectionChange={onSelectionChange}
          />
        </>
      )}
    </Container>
  )
}

export default LocationsList
