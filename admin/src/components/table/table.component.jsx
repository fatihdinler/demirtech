import React, { useState, useMemo, useEffect, useRef } from 'react'
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
  FaEllipsisV,
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
  const tableContainerRef = useRef(null)
  
  const [filterValues, setFilterValues] = useState({})
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [containerHeight, setContainerHeight] = useState('auto')

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

  // filteredData tanımlandıktan sonra useEffect'i çalıştır
  useEffect(() => {
    const updateHeight = () => {
      if (tableContainerRef.current) {
        const windowHeight = window.innerHeight
        const tableTop = tableContainerRef.current.getBoundingClientRect().top
        const footerHeight = 60 // Tahmini footer yüksekliği
        const offset = 40 // Ekstra boşluk
        
        // Toplam veri sayısını kontrol et
        const rowsToDisplay = Math.min(pageSize, filteredData.length)
        const minRowHeight = 56 // Tahmini satır yüksekliği
        const headerHeight = 48 // Header yüksekliği
        
        // Gösterilecek içeriğe göre minumum yükseklik hesapla
        const contentHeight = (rowsToDisplay * minRowHeight) + headerHeight
        
        // Görünür alanın tablodan footer'a kadar olan yüksekliği
        const availableHeight = windowHeight - tableTop - footerHeight - offset
        
        // İçerik az ise içeriğe göre, çok ise maksimum alana göre boyutlandır
        setContainerHeight(`${Math.min(Math.max(contentHeight, 200), availableHeight)}px`)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    
    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [pageSize, filteredData.length]) // pageSize ve filteredData değiştiğinde yeniden hesapla

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
    const [show, setShow] = useState(false)
    const dropdownRef = useRef(null)

    const editOperation = () => {
      navigate(`${editRoute[0]}/${row.id}${editRoute[1]}`)
    }

    const deleteOperation = () => {
      handleDelete(row.id)
    }

    useEffect(() => {
      // Dropdown dışına tıklandığında menüyü kapat
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShow(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    return (
      <div className="pro-dropdown-container" ref={dropdownRef}>
        <button
          className="pro-dropdown-button"
          onClick={(e) => {
            e.stopPropagation();
            setShow(!show);
          }}
        >
          <FaEllipsisV />
        </button>
        {show && (
          <div className="pro-dropdown-menu-custom">
            <div
              className="pro-dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                editOperation();
                setShow(false);
              }}
            >
              <FaPencilAlt className="pro-dropdown-icon edit" />
              <span>Düzenle</span>
            </div>
            <div
              className="pro-dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                deleteOperation();
                setShow(false);
              }}
            >
              <FaTrash className="pro-dropdown-icon delete" />
              <span>Sil</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className='pro-table-card d-flex flex-column'>
      <div
        className='pro-table-container flex-grow-1'
        ref={tableContainerRef}
        style={{ height: containerHeight }}
      >
        <div className='pro-table-wrapper'>
          <BootstrapTable bordered hover responsive className='pro-table'>
            <thead className='pro-table-header'>
              <tr>
                {columns.map((col) => (
                  <th key={col.accessor} style={{ minWidth: col.minWidth }}>
                    <div className='pro-column-header'>
                      <span
                        onClick={() =>
                          col.sortable !== false && handleSort(col.accessor)
                        }
                        className={col.sortable !== false ? 'pro-sortable-header' : ''}
                      >
                        {col.header}
                        {col.sortable !== false && (
                          <span className='pro-sort-wrapper'>
                            {sortConfig.key === col.accessor ? (
                              sortConfig.direction === 'asc' ? (
                                <FaSortUp className='pro-sort-icon active' />
                              ) : (
                                <FaSortDown className='pro-sort-icon active' />
                              )
                            ) : (
                              <FaSort className='pro-sort-icon inactive' />
                            )}
                          </span>
                        )}
                      </span>
                      {col.filterable && (
                        <OverlayTrigger
                          trigger='click'
                          placement='bottom'
                          rootClose
                          overlay={
                            <Tooltip id={`tooltip-${col.accessor}`} className='pro-filter-tooltip'>
                              <Form.Control
                                size='sm'
                                type='text'
                                placeholder='Filtre...'
                                value={filterValues[col.accessor] || ''}
                                onChange={(e) =>
                                  handleFilterChange(col.accessor, e.target.value)
                                }
                                className='pro-filter-input'
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
                    <div className='pro-empty-state'>
                      <span className='pro-empty-icon'>📋</span>
                      <p>Kayıt bulunamadı.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </BootstrapTable>
        </div>
      </div>
      <Card.Footer className='pro-table-footer'>
        <div className='pro-footer-info'>
          <span>Toplam: <strong>{sortedData.length}</strong> kayıt</span>
        </div>
        <Pagination className='pro-pagination'>
          {renderPagination()}
        </Pagination>
        <div className='pro-page-size'>
          <span>Sayfa Başına:</span>
          <Form.Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className='pro-page-size-select'
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Form.Select>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default Table