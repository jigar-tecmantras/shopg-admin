/* eslint-disable array-callback-return */
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
import {DefaultColumnFilter} from 'Common/Filter';
import {debounce} from 'lodash';
import {toast} from 'react-toastify';

// import {ProductsGlobalFilter} from './GlobalSearchFilter';

interface GlobalFilterProps {
  readonly preGlobalFilteredRows?: any;
  readonly globalFilter?: any;
  readonly setGlobalFilter?: any;
  readonly SearchPlaceholder?: string;
  readonly isProductsFilter?: boolean;
  isSearchByID?: boolean;
  onSearchByID?: any;
  onSearch?: any;
  orderStatusFilter?: any;
  handleOrderStatusFilter?: any;
  setOrderStatusFilter?: any;
  handlePaymentTypeFilter?: any;
  handleDeleverySelect: any;
}

// Define a default UI for filtering
function GlobalFilter({
  globalFilter,
  setGlobalFilter,
  SearchPlaceholder,
  isProductsFilter,
  setOrderStatusFilter,
  handleOrderStatusFilter,
  handlePaymentTypeFilter,
  handleDeleverySelect,
  isSearchByID,
  onSearchByID,
  onSearch,
}: GlobalFilterProps): React.JSX.Element {
  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    undefined,
  );
  const handleNormalSearchChange = debounce((value: string) => {
    // Call the handler for normal search
    onSearch?.(value);
  }, 500);
  const handleOrderIDSearchChange = debounce((value: string) => {
    // If orderIDSearchValue is blank, show all data
    onSearchByID?.(value ?? '');
  }, 500);
  useEffect(() => {
    return () => {
      // Cleanup the debounced functions when the component unmounts
      handleNormalSearchChange.cancel();
      handleOrderIDSearchChange.cancel();
    };
  }, []);
  const [selectedOrderStatus, setSelectedOrderStatus] = React.useState('');
  const [selectedPaymentType, setSelectedPaymentType] = React.useState('');
  // const [selectedDeleveryPerson, setSelectedDeliveryPerson] =
  //   React.useState('');
  const resetFilters = (): void => {
    setOrderStatusFilter('');
    handlePaymentTypeFilter('');
    handleDeleverySelect('');
    setGlobalFilter('');
    setSelectedOrderStatus('');
    setSelectedPaymentType('');
    setSearchValue('');
    onSearch?.('');
    // setSelectedDeliveryPerson('');
  };

  return (
    <Col className="col-sm d-flex justify-content-end">
      <div className="d-flex justify-content-between text-right gap-3 px-2 py-2">
        {/* First Dropdown (Select Status) */}
        <div className="mb-1">
          <select
            onChange={e => {
              handleOrderStatusFilter(e.target.value);
              setSelectedOrderStatus(e.target.value);
            }}
            value={selectedOrderStatus}
            className="form-select me-2">
            <option value="" selected disabled>
              Select Order Status
            </option>
            <option value="CANCELED">CANCELED</option>
            <option value="PENDING">PENDING</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
        </div>

        {/* Second Dropdown (Select Payment Method) */}
        <div className="mb-1">
          <select
            onChange={e => {
              handlePaymentTypeFilter(Number(e.target.value));
              setSelectedPaymentType(e.target.value);
            }}
            value={selectedPaymentType}
            className="form-select me-2">
            <option value="">Select Payment Method</option>
            <option value="21">Cash</option>
            <option value="22">Online Payment</option>
          </select>
        </div>
        {!isSearchByID && (
          <div className=" mb-1">
            {/* <div className="search-box me-xxl-2 my-3 my-xxl-0 d-inline-block"> */}

            <div className="">
              <label htmlFor="search-bar-0" className="search-label">
                {/* <span id="search-bar-0-label" className="sr-only">
                Search this table
              </span> */}
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
            {/* </div> */}
          </div>
        )}

        {/* Reset Button */}
        <div className="mb-1">
          <Button
            variant="secondary"
            onClick={resetFilters}
            className="btn btn-secondary">
            Reset
          </Button>
        </div>
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
  orderStatusValue?: any;
  setOrderStatusFilter?: any;
  handleOrderStatusFilter?: any;
  handlePaymentTypeFilter?: any;
  handleDeleverySelect?: any;
  isDownload?: any;
  isDownloadAPI?: any;
}

const OrderTableContainer = ({
  columns,
  onSearchByID,
  onSearch,
  handleOrderStatusFilter,
  handlePaymentTypeFilter,
  handleDeleverySelect,
  setOrderStatusFilter,
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
  isDownload,
  isDownloadAPI,
}: TableContainerProps): React.JSX.Element => {
  const [tableData, setTableData] = useState(data ?? []);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const loader: HTMLElement | null = document.getElementById('cover-spin');
    // console.log('🚀 ~ useEffect ~ data:', data);
    if (loader != null) {
      if (data?.length < 1 && currentData !== 0) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }
  }, [data]);
  useEffect(() => {
    setTableData(data);
  }, [data]);

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
  const isDataAvailable = data?.length;
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

  const ExcelDownload = async (): Promise<void> => {
    try {
      let data: {data?: string} | undefined;
      let fileUrl: string | undefined;
      if (isDownloadAPI) {
        data = (await isDownloadAPI()) as {data?: string};
        fileUrl = data?.data;
      }
      if (isDownloadAPI && data?.data) {
        const link = document.createElement('a');
        if (fileUrl) {
          link.href = fileUrl;
          // Automatically extract file name from URL
          const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
          link.setAttribute('download', fileName);

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        toast.error('No data found');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <Fragment>
      {isLoading && (
        <div id="cover-spin1">
          <div className="spinner"></div>
        </div>
      )}
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
            handleOrderStatusFilter={handleOrderStatusFilter}
            handlePaymentTypeFilter={handlePaymentTypeFilter}
            setOrderStatusFilter={setOrderStatusFilter}
            handleDeleverySelect={handleDeleverySelect}
          />
        )}
        {isDownload != null && (
          <Col sm="auto" className="mb-1">
            <div>
              <Button
                role="add-Btn"
                variant="primary"
                onClick={ExcelDownload}
                className="add-btn">
                <i className="bi bi-download me-1 align-middle"></i>
                Download
              </Button>
            </div>
          </Col>
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

      <div
        className="table-responsive react-table"
        style={isDataAvailable > 0 ? {minHeight: '280px'} : {}}>
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
      {page.length <= 0 && !isLoading && (
        <div className="text-center py-5">
          <h2
            className="fw-semibold mb-2"
            style={{ color: '#878a99' }}
          >
            Nothing to Display
          </h2>
          <p className="text-muted mb-0">
            There are no records available at the moment.
          </p>
        </div>
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

OrderTableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default OrderTableContainer;
