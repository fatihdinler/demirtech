import { Breadcrumb, CreateButton } from '../../components'

const ListPagesHeader = ({ breadcrumbItems, navigateTo }) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <Breadcrumb paths={breadcrumbItems} />
      <CreateButton link={navigateTo} />
    </div>
  )
}

export default ListPagesHeader
