import React, { useState, useMemo } from 'react'
import {
  Card,
  Form,
  Pagination,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Table as BootstrapTable,
} from 'react-bootstrap'
import {
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPencilAlt,
  FaTrash,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import './table.css'

const Table = ({
  data,
  columns,
  pageSizeOptions = [10, 20, 50, 100],
  defaultPageSize = 10,
  editRoute,
  handleDelete,
}) => {
  const navigate = useNavigate()

  const [filterValues, setFilterValues] = useState({})
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const handleFilterChange = (accessor, value) => {
    setFilterValues((prev) => ({ ...prev, [accessor]: value }))
    setCurrentPage(1)
  }

  const handleSort = (accessor) => {
    if (sortConfig.key === accessor) {
      setSortConfig({
        key: accessor,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      })
    } else {
      setSortConfig({ key: accessor, direction: 'asc' })
    }
  }

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      columns.every((col) => {
        if (col.filterable && filterValues[col.accessor]) {
          const filterVal = filterValues[col.accessor].toLowerCase()
          const itemVal = (item[col.accessor] || '').toString().toLowerCase()
          return itemVal.includes(filterVal)
        }
        return true
      })
    )
  }, [data, columns, filterValues])

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const renderPagination = () => {
    const visiblePages = 3
    let startPage = currentPage - Math.floor(visiblePages / 2)
    if (startPage < 1) startPage = 1
    let endPage = startPage + visiblePages - 1
    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - visiblePages + 1)
    }
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      )
    }
    return (
      <>
        <Pagination.First
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          {'<<'}
        </Pagination.First>
        <Pagination.Prev
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {'<'}
        </Pagination.Prev>
        {pages}
        <Pagination.Next
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        >
          {'>'}
        </Pagination.Next>
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          {'>>'}
        </Pagination.Last>
      </>
    )
  }

  const ActionsMenu = ({ row }) => {
    const editOperation = () => {
      navigate(`${editRoute[0]}/${row.id}${editRoute[1]}`)
    }

    const deleteOperation = () => {
      handleDelete(row.id)
    }

    return (
      <Dropdown align='end'>
        <Dropdown.Toggle as='button' className='pro-dropdown-button'>
          <span style={{ fontSize: '1rem' }}>⋮</span>
        </Dropdown.Toggle>
        <Dropdown.Menu
          renderMenuOnMount
          style={{ zIndex: 1000 }}
          popperConfig={{
            modifiers: [
              { name: 'offset', options: { offset: [0, 0] } },
              { name: 'flip', enabled: false },
              { name: 'preventOverflow', options: { boundary: 'viewport', padding: 8 } },
            ],
          }}
          className='pro-dropdown-menu'
        >
          <Dropdown.Item onClick={editOperation} className='d-flex align-items-center'>
            <FaPencilAlt size={16} className='me-2' style={{ color: '#28a745' }} />
            Düzenle
          </Dropdown.Item>
          <Dropdown.Item onClick={deleteOperation} className='d-flex align-items-center'>
            <FaTrash size={16} className='me-2' style={{ color: '#dc3545' }} />
            Sil
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  return (
    <Card className='pro-table-card'>
      <div className='pro-table-container'>
        <BootstrapTable bordered hover responsive className='pro-table'>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} style={{ minWidth: col.minWidth }}>
                  <div className='pro-column-header'>
                    <span
                      onClick={() =>
                        col.sortable !== false && handleSort(col.accessor)
                      }
                      style={{
                        cursor: col.sortable !== false ? 'pointer' : 'default',
                      }}
                    >
                      {col.header}
                      {col.sortable !== false &&
                        sortConfig.key === col.accessor && (
                          sortConfig.direction === 'asc' ? (
                            <FaSortUp className='pro-sort-icon' />
                          ) : (
                            <FaSortDown className='pro-sort-icon' />
                          )
                        )}
                      {col.sortable !== false &&
                        sortConfig.key !== col.accessor && (
                          <FaSort className='pro-sort-icon inactive' />
                        )}
                    </span>
                    {col.filterable && (
                      <OverlayTrigger
                        trigger='click'
                        placement='bottom'
                        rootClose
                        overlay={
                          <Tooltip id={`tooltip-${col.accessor}`}>
                            <Form.Control
                              size='sm'
                              type='text'
                              placeholder='Filtre...'
                              value={filterValues[col.accessor] || ''}
                              onChange={(e) =>
                                handleFilterChange(col.accessor, e.target.value)
                              }
                              style={{ minWidth: '150px' }}
                            />
                          </Tooltip>
                        }
                      >
                        <button className='pro-filter-button'>
                          <FaFilter />
                        </button>
                      </OverlayTrigger>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className='pro-table-row'>
                  {columns.map((col) => {
                    if (col.render) {
                      return (
                        <td key={`${row.id || rowIndex}-${col.accessor}`}>
                          {col.render(row[col.accessor], row)}
                        </td>
                      )
                    }
                    if (col.accessor === 'actions') {
                      return (
                        <td key={`actions-${rowIndex}`} className='pro-actions-cell'>
                          <ActionsMenu row={row} />
                        </td>
                      )
                    }
                    return (
                      <td key={`${row.id || rowIndex}-${col.accessor}`}>
                        {row[col.accessor]}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='pro-no-data'>
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </BootstrapTable>
      </div>
      <Card.Footer className='pro-table-footer'>
        <Pagination className='pro-pagination'>
          {renderPagination()}
        </Pagination>
        <div className='pro-page-size'>
          <span>Sayfa Başına:</span>
          <Form.Control
            as='select'
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className='page-size-select'
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Form.Control>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default Table
