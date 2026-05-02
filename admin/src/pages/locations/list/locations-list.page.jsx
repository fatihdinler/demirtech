import useLocationsList from './locations-list.hook'
import LocationsListTable from './locations-list.table'
import { ListPagesHeader, Loading } from '../../../components'

const LocationsList = () => {
  const { locations, isLoading, error, branches } = useLocationsList()

  return (
    <div>
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
    </div>
  )
}

export default LocationsList
