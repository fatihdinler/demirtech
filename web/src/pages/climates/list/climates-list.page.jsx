import useClimatesList from './climates-list.hook'
import ClimatesListTable from './climates-list.table'
import { ListPagesHeader, Loading } from '../../../components'
import { Container } from 'react-bootstrap'

const ClimatesList = () => {
  const {
    climates,
    isLoading,
    error,
    branches,
  } = useClimatesList()
  return (
    <Container fluid>
      <>
        {isLoading && error === null ? (
          <Loading />
        ) : (
          <>
            <ListPagesHeader
              breadcrumbItems={[{ label: 'Klimalar', link: '/climates' }]}
              navigateTo='/climates/create'
            />
            <ClimatesListTable climates={climates} branches={branches} />
          </>
        )}
      </>
    </Container>
  )
}

export default ClimatesList