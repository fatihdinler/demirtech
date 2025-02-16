// Table.jsx
import React, { useState, useMemo } from 'react';
import { Card, Form, Pagination, Dropdown } from 'react-bootstrap';
import { FaFilter, FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './table.css';

const Table = ({
  data,
  columns,
  pageSizeOptions = [10, 20, 50, 100],
  defaultPageSize = 10,
  editRoute,
}) => {
  const navigate = useNavigate();

  const [filterVisible, setFilterVisible] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const toggleFilter = (accessor) => {
    setFilterVisible((prev) => ({
      ...prev,
      [accessor]: !prev[accessor],
    }));
  };

  // Filtre değerlerini günceller
  const handleFilterChange = (accessor, value) => {
    setFilterValues((prev) => ({ ...prev, [accessor]: value }));
    setCurrentPage(1);
  };

  // Veriye göre filtre uygula
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

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Sayfalama numaralarının oluşturulması
  const renderPaginationItems = () => {
    let items = [];
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

  // Satırdaki “Actions” sütunu için menü (Düzenle, Sil)
  const ActionsMenu = ({ row }) => {
    const handleEdit = () => {
      // editRoute, örneğin ['/edit', '?mode=edit'] şeklinde bekleniyor.
      navigate(`${editRoute[0]}/${row.id}${editRoute[1]}`);
    };

    const handleDelete = () => {
      // Silme işlemini burada tanımlayabilirsiniz.
      console.log('Silinecek kayıt:', row);
    };

    return (
      <Dropdown align="end">
        <Dropdown.Toggle as="button" className="antd-dropdown-button">
          <FaEllipsisV />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleEdit}>Düzenle</Dropdown.Item>
          <Dropdown.Item onClick={handleDelete}>Sil</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <Card className="antd-table-card">
      <Card.Body className="p-0">
        <table className="antd-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor}>
                  <div className="antd-column-header">
                    <span>{col.header}</span>
                    {col.filterable && (
                      <button
                        className="antd-filter-button"
                        onClick={() => toggleFilter(col.accessor)}
                      >
                        <FaFilter />
                      </button>
                    )}
                  </div>
                  {col.filterable && filterVisible[col.accessor] && (
                    <div className="antd-filter-input">
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Filtre..."
                        value={filterValues[col.accessor] || ''}
                        onChange={(e) =>
                          handleFilterChange(col.accessor, e.target.value)
                        }
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="antd-table-row">
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
                <td colSpan={columns.length} className="antd-no-data">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card.Body>

      <Card.Footer className="antd-table-footer">
        <Pagination className="antd-pagination">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          />
          {renderPaginationItems()}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          />
        </Pagination>
        <div className="antd-page-size">
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
