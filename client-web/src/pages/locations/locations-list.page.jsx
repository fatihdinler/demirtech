import useLocationsList from './locations-list.hook'
import { Container } from 'react-bootstrap'
import { SelectableLocationCard, ListPagesHeader } from '../../components'

const LocationsList = () => {
  const {
    locations,
    isPageLoading,
    refetch,
    error,
  } = useLocationsList()

  console.log('locations --->', locations)
  return (
    <Container fluid>
      <ListPagesHeader
        breadcrumbItems={[{ label: 'Lokasyonlar', link: '/locations' }]}
      />
      <SelectableLocationCard />
    </Container>
  )
}

export default LocationsList