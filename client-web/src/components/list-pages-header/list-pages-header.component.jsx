import React from 'react'
import { Breadcrumb, CreateButton } from '../../components'

const ListPagesHeader = ({ breadcrumbItems, navigateTo }) => {
  return (
    <div className='d-flex justify-content-between align-items-center mx-2'>
      <Breadcrumb paths={breadcrumbItems} />
      <CreateButton link={navigateTo} />
    </div>
  )
}

export default ListPagesHeader