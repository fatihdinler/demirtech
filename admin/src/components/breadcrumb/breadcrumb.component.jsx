import React from 'react'
import { Breadcrumb as RBBreadcrumb } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Breadcrumb = ({ paths }) => {
  return (
    <RBBreadcrumb>
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1
        return (
          <RBBreadcrumb.Item
            key={index}
            active={isLast}
            linkAs={isLast ? 'span' : Link}
            linkProps={isLast ? {} : { to: path.link }}>
            {path.label}
          </RBBreadcrumb.Item>
        )
      })}
    </RBBreadcrumb>
  )
}

export default Breadcrumb