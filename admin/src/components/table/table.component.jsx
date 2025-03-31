import React, { useState, useMemo } from 'react';
import {
  Card,
  Form,
  Pagination,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Table as BootstrapTable,
} from 'react-bootstrap';
import {
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEllipsisV,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './table.css';

const Table = ({
  data,
  columns,
  pageSizeOptions = [10, 20, 50, 100],
  defaultPageSize = 10,
  editRoute,
  handleDelete,
}) => {
  const navigate = useNavigate();

  // Filtre ve sıralama durumları
  const [filterValues, setFilterValues] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sayfalama durumları
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Filtre değerlerini günceller
  const handleFilterChange = (accessor, value) => {
    setFilterValues((prev) => ({ ...prev, [accessor]: value }));
    setCurrentPage(1);
  };

  // Sıralama işlemini gerçekleştirir
  const handleSort = (accessor) => {
    if (sortConfig.key === accessor) {
      setSortConfig({
        key: accessor,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ key: accessor, direction: 'asc' });
    }
  };

  // Veriyi filtrele
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      columns.every((col) => {
        if (col.filterable && filterValues[col.accessor]) {
          const filterVal = filterValues[col.accessor].toLowerCase();
          const itemVal = (item[col.accessor] || '').toString().toLowerCase();
          return itemVal.includes(filterVal);
        }
        return true;
      })
    );
  }, [data, columns, filterValues]);

  // Filtrelenmiş veriyi sıralama
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Sayfalama: sıralanmış veriden sadece o sayfadakileri alır
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Sayfa numaralarını oluşturur
  const renderPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return items;
  };

  // Her satır için aksiyon menüsü (Düzenle, Sil)
  const ActionsMenu = ({ row }) => {
    const editOperation = () => {
      navigate(`${editRoute[0]}/${row.id}${editRoute[1]}`);
    };

    const deleteOperation = () => {
      handleDelete(row.id);
    };

    return (
      <Dropdown align="end">
        <Dropdown.Toggle as="button" className="pro-dropdown-button">
          <FaEllipsisV />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={editOperation}>Düzenle</Dropdown.Item>
          <Dropdown.Item onClick={deleteOperation}>Sil</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <Card className="pro-table-card">
      <Card.Body className="p-0">
        <BootstrapTable bordered hover responsive className="pro-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor}>
                  <div className="pro-column-header">
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
                            <FaSortUp className="pro-sort-icon" />
                          ) : (
                            <FaSortDown className="pro-sort-icon" />
                          )
                        )}
                      {col.sortable !== false &&
                        sortConfig.key !== col.accessor && (
                          <FaSort className="pro-sort-icon inactive" />
                        )}
                    </span>
                    {col.filterable && (
                      <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        rootClose
                        overlay={
                          <Tooltip id={`tooltip-${col.accessor}`}>
                            <Form.Control
                              size="sm"
                              type="text"
                              placeholder="Filtre..."
                              value={filterValues[col.accessor] || ''}
                              onChange={(e) =>
                                handleFilterChange(col.accessor, e.target.value)
                              }
                              style={{ minWidth: '150px' }}
                            />
                          </Tooltip>
                        }
                      >
                        <button className="pro-filter-button">
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
                <tr key={row.id || rowIndex} className="pro-table-row">
                  {columns.map((col) => {
                    if (col.render) {
                      return (
                        <td key={`${row.id || rowIndex}-${col.accessor}`}>
                          {col.render(row[col.accessor], row)}
                        </td>
                      );
                    }
                    if (col.accessor === 'actions') {
                      return (
                        <td key={`actions-${rowIndex}`}>
                          <ActionsMenu row={row} />
                        </td>
                      );
                    }
                    return (
                      <td key={`${row.id || rowIndex}-${col.accessor}`}>
                        {row[col.accessor]}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="pro-no-data">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </BootstrapTable>
      </Card.Body>
      <Card.Footer className="pro-table-footer">
        <Pagination className="pro-pagination">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          />
          {renderPaginationItems()}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
          />
        </Pagination>
        <div className="pro-page-size">
          <span>Sayfa Başına:</span>
          <Form.Control
            as="select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="page-size-select"
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
  );
};

export default Table;
