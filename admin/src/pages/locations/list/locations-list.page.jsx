import useLocationsList from './locations-list.hook'
import LocationsListTable from './locations-list.table'
import { ListPagesHeader, Loading } from '../../../components'
import { Container } from 'react-bootstrap'

const LocationsList = () => {
  const {
    locations,
    isLoading,
    error,
    branches,
  } = useLocationsList()
  return (
    <Container fluid>
      <>
        {isLoading && error === null ? (
          <Loading />
        ) : (
          <>
            <ListPagesHeader
              breadcrumbItems={[{ label: 'Lokasyonlar', link: '/locations' }]}
              navigateTo='/locations/create'
            />
            <LocationsListTable locations={locations} branches={branches} />
          </>
        )}
      </>
    </Container>
  )
}

export default LocationsList