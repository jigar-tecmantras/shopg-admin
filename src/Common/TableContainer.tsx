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
import {Table, Row, Col, Button, Form} from 'react-bootstrap';
import {DefaultColumnFilter} from './Filter';
import Select from 'react-select';

import {ProductsGlobalFilter} from './GlobalSearchFilter';
import {variables} from 'utils/constant';
import {useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import ApiUtils from 'api/ApiUtils';
import Swal from 'sweetalert2';
import {useSelector} from 'react-redux';

interface GlobalFilterProps {
  readonly preGlobalFilteredRows?: any;
  readonly globalFilter?: any;
  readonly setGlobalFilter?: any;
  readonly SearchPlaceholder?: string;
  readonly isProductsFilter?: boolean;
  isSearchByID?: boolean;
  onSearchByID?: any;
  onSearch?: any;
  resetSearchFlag?: boolean;
  categoryFilter?: boolean;
  setResetSearchFlag?: any;
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
  resetSearchFlag, // setResetSearchFlag,
  categoryFilter,
  setResetSearchFlag,
}: GlobalFilterProps): React.JSX.Element {
  // const [value, setValue] = React.useState(globalFilter);
  const [searchType, setSearchType] = React.useState<string>('normal');

  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    undefined,
  );
  const [orderIDSearchValue, setOrderIDSearchValue] = React.useState<
    string | undefined
  >(undefined);

  // Custom debounce hook (optional)
  const useDebounce = (value: string, delay: number): any => {
    const [debouncedValue, setDebouncedValue] = useState<string>(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchValue = useDebounce(orderIDSearchValue ?? '', 500);

  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      onSearchByID?.(debouncedSearchValue);
    }
  }, [debouncedSearchValue]);

  // const onChange = (value: any): void => {
  //   setGlobalFilter(value ?? undefined);
  // };
  const handleNormalSearchChange = (value: string): void => {
    setSearchValue(value);
    // Call the handler for normal search
    onSearch?.(value);
  };

  const handleOrderIDSearchChange = (): void => {
    // If orderIDSearchValue is blank, show all data
    onSearchByID?.(orderIDSearchValue ?? '');
  };
  const handleSearchTypeChange = (selectedType: string): void => {
    setSearchType(selectedType);
    setSearchValue('');
  };

  useEffect(() => {
    if (resetSearchFlag) {
      console.log('asasasas child');
      setSearchValue('');
      setResetSearchFlag();
    }
  }, [resetSearchFlag]);
  const location = useLocation();
  const isBannersRoute = location.pathname === '/banner';
  return (
    <React.Fragment>
      {!categoryFilter && (
        <Col className="col-sm">
          <div className="d-flex justify-content-between gap-1 px-1 py-2 sd">
            <Col md={7}></Col>
            <div className="d-flex align-items-center mb-2">
              {(isProductsFilter ?? false) && <ProductsGlobalFilter />}
              {isSearchByID && (
                <React.Fragment>
                  <Col className="col-md px-3">
                    <div className="d-flex align-items-center">
                      <select
                        value={searchType}
                        onChange={e => {
                          handleSearchTypeChange(e.target.value);
                        }}
                        className="form-select me-2"
                        style={{width: '50%'}}>
                        <option value="normal">Search By Payment</option>
                        <option value="searchByID">Search By Order ID</option>
                      </select>

                      {searchType === 'normal' ? (
                        <label htmlFor="search-bar-0" className="search-label">
                          <input
                            onChange={e => {
                              setSearchValue(e.target.value);
                              handleNormalSearchChange(e.target.value);
                            }}
                            id="search-bar-0 "
                            type="text"
                            className="form-control"
                            placeholder={SearchPlaceholder}
                            value={searchValue ?? ''}
                          />
                        </label>
                      ) : (
                        <label htmlFor="search-bar-0" className="search-label">
                          <input
                            onChange={e => {
                              setOrderIDSearchValue(e.target.value);
                              handleOrderIDSearchChange();
                            }}
                            id="search-bar-0"
                            type="text"
                            className="form-control"
                            placeholder="Search By Order ID..."
                            value={orderIDSearchValue ?? ''}
                          />
                        </label>
                      )}
                    </div>
                  </Col>
                </React.Fragment>
              )}
            </div>
          </div>
        </Col>
      )}
      {!isSearchByID && (
        <Col className="col-sm">
          {/* <div className="search-box me-xxl-2 my-3 my-xxl-0 d-inline-block"> */}

          <div className="d-flex justify-content-sm-end px-2 py-2 my-2">
            <label htmlFor="search-bar-0" className={`search-label  `}>
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
                className={`form-control ${isBannersRoute ? 'd-none' : ''}`}
                placeholder={SearchPlaceholder}
                value={searchValue ?? ''}
              />
            </label>
          </div>
          {/* </div> */}
        </Col>
      )}
    </React.Fragment>
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
  SearchPlaceholder: string;
  isProductsFilter?: boolean;
  setPageSize?: (pageSize: number) => void;
  pageSize?: number;
  currentData?: any;
  buttonText?: string;
  sortColumn?: any;
  sortDirection?: string;
  isSearchByID?: boolean;
  isNotPagination?: boolean;
  onSearchByID?: (value: string) => void;
  onSearch?: (value: string) => void;
  handleSortByColumn?: (columnName: string) => void;

  isChangeStatus?: boolean;
  isCategory?: boolean;
  statusClickevent?: any;
  resetSearchFlag?: boolean;
  isDownload?: boolean;
  isImport?: boolean;
  isDownloadAPI?: any;
  setIsImport?: any;
  DownloadSearchValue?: any;
  subscriberTotal?: number; // <-- add this prop
  categoryFilter?: boolean;
  categoryListOption?: any;
  handleSelectCategoryChange?: any;
  selectedCategoryOption?: any;
  setResetSearchFlag?: any;
}

const TableContainer = ({
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
  isNotPagination,
  isSearchByID,
  isChangeStatus,
  isCategory,
  statusClickevent,
  resetSearchFlag, // setResetSearchFlag,
  isDownload,
  isImport,
  isDownloadAPI,
  setIsImport,
  DownloadSearchValue,
  subscriberTotal,
  categoryFilter,
  categoryListOption,
  handleSelectCategoryChange,
  selectedCategoryOption,
  setResetSearchFlag,
}: TableContainerProps): React.JSX.Element => {
  const [tableData, setTableData] = useState(data ?? []);

  useEffect(() => {
    setTableData(data);
  }, [data]);
  const isDataAvailable = data?.length;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
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
  // test comment
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
  const location = useLocation();
  const isProductRoute = location.pathname === '/products';
  const ExcelDownload = async (): Promise<void> => {
    try {
      let data: {data?: string} | undefined;
      let fileUrl: string | undefined;

      let valuesArray: string[] = [];

      if (selectedCategoryOption?.length > 0) {
        valuesArray = selectedCategoryOption.map((item: any) => item.value);
      }

      const payload = {
        category_id: valuesArray.length > 0 ? valuesArray : undefined,
      };

      if (isDownloadAPI) {
        if (DownloadSearchValue) {
          data = (await isDownloadAPI(payload)) as {data?: string};
          fileUrl = data?.data;
        } else {
          data = (await isDownloadAPI(payload)) as {data?: string};
          fileUrl = data?.data;
        }
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
  const ImportExcel = async (file: File): Promise<void> => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }

      const response: any = await ApiUtils.importDiscount(formData);

      if (response?.skipped_message && response?.skipped_message !== '') {
        await Swal.fire({
          title: 'Warning!!',
          text: response?.skipped_message,
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
        setIsImport(!isImport);
      }
      if (response?.message && response?.skipped_message === '') {
        toast.success(response?.message);
        setIsImport(!isImport);
      } else {
        if (response?.skipped_message === '') {
          toast.error('Failed to import Excel');
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const {Layout}: any = useSelector(state => state);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (Layout.layoutModeType === 'dark') {
      setIsDark(true);
    } else if (Layout.layoutModeType === 'light') {
      setIsDark(false);
    } else {
      setIsDark(false);
    }
  }, [Layout.layoutModeType]);

  const colourStyles = {
    control: (base: any) => ({
      ...base,
      background: '#0c192c',
      borderColor: '#132846',
      borderRadius: '0px',
      '&:hover': {
        borderColor: '#132846',
      },
    }),
    option: (provided: any, state: {isFocused: boolean}) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#6cb5f9' : '#0E203A', // Set background color to white when focused
      color: state.isFocused ? 'white' : '#bbc2cd', // Set text color to black when focused
      '&:hover': {
        backgroundColor: '#6cb5f9', // Set background color to white on hover
        color: 'white', // Set text color to black on hover
      },
    }),
  };
  return (
    <Fragment>
      <Row className="align-items-center">
        {iscustomPageSize != null && (
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          <Col md={customPageSizeOptions || 2} className="px-3 my-2">
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
        {subscriberTotal != null && (
          <Col
            md="auto"
            className="px4 my-2"
            style={{display: 'flex', alignItems: 'center'}}>
            <span style={{fontWeight: 600, fontSize: '20px'}}>
              Total Subscribers: {subscriberTotal}
            </span>
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
            resetSearchFlag={resetSearchFlag}
            categoryFilter={categoryFilter}
            setResetSearchFlag={setResetSearchFlag}
          />
        )}

        {categoryFilter && (
          <>
            <Col>
              <div aria-labelledby="category-name-label" className="">
                <Select
                  isMulti
                  id="category-name"
                  name="category-name"
                  value={selectedCategoryOption}
                  styles={isDark ? colourStyles : {}}
                  onChange={handleSelectCategoryChange}
                  options={categoryListOption}></Select>
              </div>
            </Col>
          </>
        )}
        {isChangeStatus != null && isChangeStatus && (
          <>
            <Col sm="auto">
              <div>
                <Form.Select
                  className="form-select"
                  id="product_status"
                  name="product_status"
                  onChange={async e => {
                    await statusClickevent(e);

                    // setSelectedProductStatus(e.target.value);
                  }}>
                  {isCategory ? (
                    <>
                      <option value="">Select Category Status</option>
                      <option value="1">Active</option>
                      <option value="2">InActive</option>
                    </>
                  ) : (
                    <>
                      <option value="">Select Product Status</option>
                      <option value={variables.PRODUCT_OPTION_ACTIVE_STATUS_ID}>
                        Active
                      </option>
                      <option
                        value={variables.PRODUCT_OPTION_INACTIVE_STATUS_ID}>
                        InActive
                      </option>
                    </>
                  )}
                </Form.Select>
              </div>
            </Col>
            {isProductRoute && (
              <Col sm="auto">
                <Button
                  role="add-Btn"
                  variant="danger"
                  className="remove-list  text-light"
                  onClick={async e => {
                    await statusClickevent(e, true);

                    // setSelectedProductStatus(e.target.value);
                  }}>
                  <i className="ri-delete-bin-fill align-bottom me-2 text-light" />
                  Delete
                </Button>
              </Col>
            )}
          </>
        )}
        {isImport != null && (
          <Col sm="auto">
            <div>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                style={{display: 'none'}}
                id="import-excel-input"
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Call your import function here
                    await ImportExcel(file);
                    // console.log('File imported:', file);
                  }
                  // Reset input value so the same file can be selected again
                  e.target.value = '';
                }}
              />
              <Button
                role="add-Btn"
                variant="success"
                className="add-btn"
                onClick={() => {
                  const input = document.getElementById(
                    'import-excel-input',
                  ) as HTMLInputElement;
                  input?.click();
                }}>
                <i className="bi bi-file-earmark-arrow-up me-1 align-middle"></i>
                Import
              </Button>
            </div>
          </Col>
        )}
        {isDownload != null && (
          <Col sm="auto">
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
              <Button
                role="add-Btn"
                variant="success"
                onClick={onClick}
                className="add-btn">
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
                        if (
                          column.id !== 'parentBox' &&
                          column.id !== 'Action' &&
                          handleSortByColumn
                        ) {
                          handleSortByColumn(column.id);
                        }
                      }}
                      {...column.getHeaderProps()}>
                      <div className="d-flex align-items-center">
                        {column.render('Header')}
                        {column.id !== 'parentBox' &&
                          column.id !== 'Action' &&
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
                        <td
                          className="scrollable-cell"
                          key={cell.id}
                          {...cell.getCellProps()}>
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
        <div className="text-center fw-bold fs-2">No data found</div>
      )}
      {!isNotPagination && (
        <Row className="align-items-center mt-2 py-2 px-2 gy-2 text-center text-sm-start">
          <div className="col-sm">
            <div className="text-muted">
              Showing{' '}
              <span className="fw-semibold">{pageIndex + pageValue}</span> of{' '}
              <span className="fw-semibold">{currentData || 1}</span> Results
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
      )}
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
