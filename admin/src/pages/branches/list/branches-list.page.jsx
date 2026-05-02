import useBranchesList from './branches-list.hook'
import BranchesListTable from './branches-list.table'
import { ListPagesHeader, Loading } from '../../../components'

const BranchesList = () => {
  const { branches, isLoading, error, customers, users } = useBranchesList()

  return (
    <div>
      {isLoading && error === null ? (
        <Loading />
      ) : (
        <>
          <ListPagesHeader
            breadcrumbItems={[{ label: 'Şubeler', link: '/branches' }]}
            navigateTo='/branches/create'
          />
          <BranchesListTable branches={branches} customers={customers} users={users} />
        </>
      )}
    </div>
  )
}

export default BranchesList
