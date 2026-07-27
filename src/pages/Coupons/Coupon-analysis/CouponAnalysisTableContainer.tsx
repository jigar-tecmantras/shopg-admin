/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {
  useGlobalFilter,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useTable,
} from 'react-table';
import {Table, Row, Col, Button} from 'react-bootstrap';
// import {DefaultColumnFilter} from './Filter';
import debounce from 'lodash/debounce';
import {DefaultColumnFilter} from 'Common/Filter';
import Flatpickr from 'react-flatpickr';

// import {ProductsGlobalFilter} from './GlobalSearchFilter';

interface GlobalFilterProps {
  readonly preGlobalFilteredRows?: any;
  readonly globalFilter?: any;
  readonly setGlobalFilter?: any;
  readonly SearchPlaceholder?: string;
  readonly isProductsFilter?: boolean;
  readonly setDateFilter?: React.Dispatch<
    React.SetStateAction<{startDate: string; endDate: string}>
  >;
  isSearchByID?: boolean;
  onSearchByID?: any;
  onSearch?: any;
  handleMediaType?: any;
  typeOfMedia: any;
}

// Define a default UI for filtering
function GlobalFilter({
  globalFilter,
  setGlobalFilter,
  SearchPlaceholder,
  isProductsFilter,
  isSearchByID,
  onSearchByID,
  onSearch,
  handleMediaType,
  typeOfMedia,
  setDateFilter,
}: GlobalFilterProps): React.JSX.Element {
  // const [value, setValue] = React.useState(globalFilter);
  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    undefined,
  );
  const [forResetMediaType, setForResetMediaType] = React.useState('');

  const handleNormalSearchChange = debounce((value: string) => {
    // Call the handler for normal search
    onSearch?.(value);
  }, 200);
  const formatDate = (date: any): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleDateFunction = (e: any): void => {
    const inputStartDate = new Date(e[0]);
    const formattedStartDate = formatDate(inputStartDate);

    const inputEndDate = new Date(e[1]);
    const formattedEndDate = formatDate(inputEndDate);

    if (setDateFilter) {
      setDateFilter((v: any) => ({
        ...v,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }));
    }
  };
  useEffect(() => {
    return () => {
      // Cleanup the debounced functions when the component unmounts
      handleNormalSearchChange.cancel();
      //   handleOrderIDSearchChange.cancel();
    };
  }, []);
  const resetFilters = (): void => {
    setForResetMediaType('');
    handleMediaType('');
    setGlobalFilter('');
  };
  return (
    <Col className="col-sm">
      <div className="d-flex justify-content-sm-end px-2 py-2 gap-2">
        <Flatpickr
          className="form-control flatpickr-input w-100"
          placeholder="Select Date"
          onChange={handleDateFunction}
          options={{
            mode: 'range',
            dateFormat: 'd M, Y',
            maxDate: new Date(),
          }}
        />
        <select
          style={{maxWidth: '15rem'}}
          onChange={e => {
            handleMediaType(e.target.value);
            setForResetMediaType(e.target.value);
          }}
          value={forResetMediaType}
          className="form-select me-2 smaller-select" // Add a class here
        >
          <option value="">Select Media Type</option>
          {typeOfMedia?.map((el: any) => (
            // eslint-disable-next-line react/jsx-key
            <option value={el.id}>{el.name}</option>
          ))}
        </select>
        <Button
          variant="secondary"
          onClick={resetFilters}
          className="btn btn-secondary me-2">
          Reset
        </Button>
        <label htmlFor="search-bar-0" className="search-label">
          <input
            onChange={e => {
              setSearchValue(e.target.value);
              handleNormalSearchChange(e.target.value);
            }}
            id="search-bar-0"
            type="text"
            className="form-control"
            placeholder={SearchPlaceholder}
            value={searchValue ?? ''}
          />
        </label>
      </div>
    </Col>
  );
}

interface TableContainerProps {
  columns?: any;
  data?: any;
  isGlobalFilter?: any;
  isAddOptions?: any;
  divClassName?: any;
  tableClassName?: any;
  theadClassName?: any;
  tableClass?: any;
  theadClass?: any;
  isBordered?: boolean;
  isAddUserList?: any;
  onClick?: any;
  handleUserClick?: any;
  handleCustomerClick?: any;
  isAddCustList?: any;
  customPageSize?: any;
  className?: any;
  pageValue?: any;
  mediaType: any;
  handleNextPagination?: any;
  handlePrevPagination?: any;
  customPageSizeOptions?: any;
  iscustomPageSize?: boolean;
  SearchPlaceholder?: string;
  isProductsFilter?: boolean;
  setPageSize?: (pageSize: number) => void;
  pageSize?: number;
  currentData?: any;
  buttonText?: string;
  sortColumn?: any;
  sortDirection?: string;
  isSearchByID?: boolean;
  onSearchByID?: (value: string) => void;
  onSearch?: (value: string) => void;
  handleSortByColumn?: (columnName: string) => void;
  handleMediaType?: any;
  readonly setDateFilter?: React.Dispatch<
    React.SetStateAction<{startDate: string; endDate: string}>
  >;
}

const CouponAnalysisTableContainer = ({
  columns,
  onSearchByID,
  onSearch,
  data,
  tableClass,
  theadClass,
  isBordered,
  isGlobalFilter,
  isProductsFilter,
  isAddOptions,
  isAddUserList,
  handleUserClick,
  handleCustomerClick,
  setPageSize,
  pageSize,
  isAddCustList,
  handleNextPagination,
  handlePrevPagination,
  customPageSize,
  pageValue,
  iscustomPageSize,
  customPageSizeOptions,
  SearchPlaceholder,
  currentData,
  buttonText,
  onClick,
  sortColumn,
  sortDirection,
  handleSortByColumn,
  isSearchByID,
  handleMediaType,
  mediaType,
  setDateFilter,
}: TableContainerProps): React.JSX.Element => {
  const [tableData, setTableData] = useState(data ?? []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canPreviousPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canNextPage,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: {pageIndex},
    setPageSize: setPageSizeTable, // Use setPageSize to update the page size
  } = useTable(
    {
      columns,
      data: useMemo(() => tableData, [tableData]),
      defaultColumn: {Filter: DefaultColumnFilter},
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortColumn: [{id: sortColumn, desc: sortDirection === 'desc'}],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
  );

  useEffect(() => {
    setTableData(data);
    setPageSizeTable?.(customPageSize);
  }, [data, customPageSize, setPageSizeTable]);
  const generateSortingIndicator = (
    columnId: string,
    sortColumn: any,
    sortDirection: any,
  ): React.ReactElement => {
    if (sortColumn && sortColumn === columnId) {
      return sortDirection === 'asc' ? (
        <span className="cursor-pointer">&#9650;</span>
      ) : (
        <span className="cursor-pointer">&#9660;</span>
      );
    }
    return <span className="cursor-pointer">&#9650;</span>;
  };

  const onChangeInSelect = (event: any): void => {
    const newSize = Number(event.target.value);
    setPageSize?.(newSize);
    // Add this line to update the pageSize state
  };
  return (
    <Fragment>
      <Row className="align-items-center">
        {iscustomPageSize != null && (
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          <Col md={customPageSizeOptions || 2} className="px-3">
            <select
              className="form-select"
              value={pageSize}
              onChange={onChangeInSelect}>
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        )}
        {isGlobalFilter != null && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            SearchPlaceholder={SearchPlaceholder}
            isProductsFilter={isProductsFilter}
            isSearchByID={isSearchByID}
            onSearch={onSearch}
            onSearchByID={onSearchByID}
            handleMediaType={handleMediaType}
            typeOfMedia={mediaType}
          />
        )}
        {isAddOptions != null && (
          <Col sm="auto">
            <div>
              <Button variant="success" onClick={onClick} className="add-btn">
                <i className="bi bi-plus-circle me-1 align-middle"></i>
                {buttonText}
              </Button>
            </div>
          </Col>
        )}
      </Row>

      {isAddUserList != null && (
        <Col sm="7">
          <div className="text-sm-end">
            <Button
              type="button"
              variant="primary"
              className="btn mb-2 me-2"
              onClick={handleUserClick}>
              <i className="mdi mdi-plus-circle-outline me-1" />
              Create New User
            </Button>
          </div>
        </Col>
      )}
      {isAddCustList != null && (
        <Col sm="7">
          <div className="text-sm-end">
            <Button
              type="button"
              variant="success"
              className="btn-rounded mb-2 me-2"
              onClick={handleCustomerClick}>
              <i className="mdi mdi-plus me-1" />
              Customers
            </Button>
          </div>
        </Col>
      )}

      <div className="table-responsive react-table">
        <Table
          hover
          {...getTableProps()}
          className={tableClass}
          bordered={isBordered}>
          <thead className={theadClass}>
            {headerGroups.map((headerGroup: any) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => {
                  return (
                    <th
                      key={column.id}
                      onClick={() => {
                        if (column.id !== 'Action' && handleSortByColumn) {
                          handleSortByColumn(column.id);
                        }
                      }}
                      {...column.getHeaderProps()}>
                      <div className="d-flex align-items-center">
                        {column.render('Header')}
                        {column.id !== 'Action' &&
                          generateSortingIndicator(
                            sortColumn,
                            column.id,
                            sortDirection,
                          )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row: any) => {
              prepareRow(row);
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr>
                    {row.cells.map((cell: any) => {
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>
      {page.length <= 0 && (
        <div className="text-center fw-bold fs-2 mt-3">No data found</div>
      )}
      <Row className="align-items-center mt-2 py-2 px-2 gy-2 text-center text-sm-start">
        <div className="col-sm">
          <div className="text-muted">
            Showing <span className="fw-semibold">{pageIndex + pageValue}</span>{' '}
            of <span className="fw-semibold">{currentData || 1}</span> Results
          </div>
        </div>
        <div className="col-sm-auto">
          <ul className="pagination pagination-separated mb-0 justify-content-center justify-content-sm-start">
            <li
              // className={
              //   canPreviousPage === null ? 'page-item disabled' : 'page-item'
              // }

              className={
                pageValue === 1 || pageValue > currentData
                  ? 'page-item disabled'
                  : 'page-item'
              }>
              <Button
                onClick={() => handlePrevPagination?.(pageValue)}
                variant="link"
                className="page-link">
                Previous
              </Button>
            </li>

            {/* <div>
               {pageOptions.map((item: any, key: number) => (
             
                <li className="page-item">
                 
                  <Button
                    variant="link"
                    className={
                      pageIndex === item ? 'page-link active' : 'page-link'
                    }>
                    {pageValue}
                  </Button>
                </li>
            
            ))}
            </div> 
            */}
            <li className="page-item">
              <Button variant="link" className={'page-link active'}>
                {pageValue}
              </Button>
            </li>
            <li
              // className={
              //   canNextPage === null ? 'page-item disabled' : 'page-item'
              // }
              className={
                // canNextPage === null ? 'page-item disabled' : 'page-item'
                currentData === pageValue || pageValue > currentData
                  ? 'page-item disabled'
                  : 'page-item'
              }>
              <Button
                onClick={() => {
                  handleNextPagination?.(pageValue);
                }}
                variant="link"
                className="page-link">
                Next
              </Button>
            </li>
          </ul>
        </div>
      </Row>
    </Fragment>
  );
};

CouponAnalysisTableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default CouponAnalysisTableContainer;
