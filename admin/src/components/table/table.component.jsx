import { useState, useMemo, useEffect, useRef } from 'react'
import {
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPencilAlt,
  FaTrash,
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

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
  const [activeFilter, setActiveFilter] = useState(null)
  const filterInputRef = useRef(null)

  useEffect(() => {
    if (activeFilter && filterInputRef.current) {
      filterInputRef.current.focus()
    }
  }, [activeFilter])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-filter-container]')) {
        setActiveFilter(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFilterChange = (accessor, value) => {
    setFilterValues((prev) => ({ ...prev, [accessor]: value }))
    setCurrentPage(1)
  }

  const handleSort = (accessor) => {
    if (sortConfig.key === accessor) {
      setSortConfig({ key: accessor, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })
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

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const getPageNumbers = () => {
    const delta = 1
    const range = []
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }
    const pages = [1]
    if (range[0] > 2) pages.push('...')
    pages.push(...range)
    if (range[range.length - 1] < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)
    return pages
  }

  const ActionsMenu = ({ row }) => {
    const [show, setShow] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
      const handler = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setShow(false)
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
      <div className="relative inline-block" ref={ref}>
        <button
          onClick={(e) => { e.stopPropagation(); setShow((s) => !s) }}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
        >
          <FaEllipsisV size={13} />
        </button>

        {show && (
          <div className="absolute right-0 top-9 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fadeSlideIn">
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`${editRoute[0]}/${row.id}${editRoute[1]}`)
                setShow(false)
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
            >
              <FaPencilAlt size={12} className="text-indigo-400" />
              Düzenle
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(row.id)
                setShow(false)
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
            >
              <FaTrash size={12} className="text-red-400" />
              Sil
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
      <div
        ref={tableContainerRef}
        className="overflow-auto scrollbar-thin flex-1"
        style={{ maxHeight: 'calc(100vh - 280px)' }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="px-5 py-3.5 text-left"
                  style={{ minWidth: col.minWidth }}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      onClick={() => col.sortable !== false && col.accessor !== 'actions' && handleSort(col.accessor)}
                      className={`text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 select-none ${
                        col.sortable !== false && col.accessor !== 'actions'
                          ? 'cursor-pointer hover:text-indigo-600'
                          : ''
                      }`}
                    >
                      {col.header}
                      {col.sortable !== false && col.accessor !== 'actions' && (
                        <span className="text-slate-300">
                          {sortConfig.key === col.accessor ? (
                            sortConfig.direction === 'asc' ? (
                              <FaSortUp size={12} className="text-indigo-500" />
                            ) : (
                              <FaSortDown size={12} className="text-indigo-500" />
                            )
                          ) : (
                            <FaSort size={12} />
                          )}
                        </span>
                      )}
                    </span>

                    {col.filterable && (
                      <div className="relative" data-filter-container>
                        <button
                          onClick={() => setActiveFilter(activeFilter === col.accessor ? null : col.accessor)}
                          className={`w-6 h-6 flex items-center justify-center rounded-md transition-all duration-150 ${
                            filterValues[col.accessor]
                              ? 'text-indigo-600 bg-indigo-100'
                              : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                          }`}
                        >
                          <FaFilter size={10} />
                        </button>

                        {activeFilter === col.accessor && (
                          <div
                            className="absolute top-8 left-0 z-50 bg-white rounded-xl shadow-xl border border-slate-100 p-2.5 animate-fadeSlideIn"
                            data-filter-container
                          >
                            <input
                              ref={filterInputRef}
                              type="text"
                              placeholder="Filtrele..."
                              value={filterValues[col.accessor] || ''}
                              onChange={(e) => handleFilterChange(col.accessor, e.target.value)}
                              className="w-48 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="hover:bg-slate-50/60 transition-colors duration-150"
                >
                  {columns.map((col) => {
                    if (col.render) {
                      return (
                        <td key={`${row.id || rowIndex}-${col.accessor}`} className="px-5 py-3.5 text-sm text-slate-700">
                          {col.render(row[col.accessor], row)}
                        </td>
                      )
                    }
                    if (col.accessor === 'actions') {
                      return (
                        <td key={`actions-${rowIndex}`} className="px-5 py-3.5 w-14">
                          <ActionsMenu row={row} />
                        </td>
                      )
                    }
                    return (
                      <td key={`${row.id || rowIndex}-${col.accessor}`} className="px-5 py-3.5 text-sm text-slate-700">
                        {row[col.accessor]}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                    <span className="text-4xl">📋</span>
                    <p className="text-sm font-medium">Kayıt bulunamadı.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex-wrap gap-3">
        <span className="text-xs text-slate-500">
          Toplam: <strong className="text-slate-700">{sortedData.length}</strong> kayıt
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-indigo-100 hover:text-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            <FaAngleDoubleLeft size={11} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-indigo-100 hover:text-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            <FaChevronLeft size={11} />
          </button>

          {getPageNumbers().map((page, i) =>
            page === '...' ? (
              <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150 ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-indigo-100 hover:text-indigo-700'
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-indigo-100 hover:text-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            <FaChevronRight size={11} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-indigo-100 hover:text-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            <FaAngleDoubleRight size={11} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Sayfa başına:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
            className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer transition-all"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default Table
