import React, {useState, useMemo, useEffect} from 'react';
import {Card, Col, Container, Dropdown, Row} from 'react-bootstrap';
import TableContainer from 'Common/TableContainer';
import DiscountModal from './DiscountModal';
import Swal from 'sweetalert2';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {variables} from 'utils/constant';

const DiscountListing = (): JSX.Element => {
  document.title = 'Price Up & Down | Warehouse ';
  const [discountList, setDiscountList] = useState<any>();
  const [editDiscount, setEditDiscount] = useState<any>({});
  const [isEditDiscount, isSetEditDiscount] = useState(false);
  const [iseAddDiscount, isSetAddDiscount] = useState(false);

  const defaultPage = 1;
  const [pageValue, setPageValue] = useState(defaultPage);
  const [sortColumn, setSortColumn] = useState('id');

  const [search, setSearch] = useState<string>('');
  const [resetSearchFlag, setResetSearchFlag] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(defaultPage);
  const currentData = Math.ceil(totalRecords / pageSize);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isImport, setIsImport] = useState(true);
  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data = await ApiUtils.getDiscountList(
          `&page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
        );

        setDiscountList((data as any).data.data);
        setTotalRecords((data as any)?.data?.total);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    void fetchData(); // Invoke the async function
  }, [
    isEditDiscount,
    iseAddDiscount,
    pageValue,
    shouldFetch,
    search,
    isImport,
  ]);

  const handleDeleteDiscount = async (id: any): Promise<void> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (result.isConfirmed) {
      ApiUtils.deleteDiscount(id)
        // eslint-disable-next-line unused-imports/no-unused-vars
        .then(async data => {
          await Swal.fire({
            title: 'Deleted!',
            text: (data as any).message,
            icon: 'success',
          });
          ApiUtils.getDiscountList(`&page=${pageValue}&page_size=${pageSize}`)
            .then(data => {
              setDiscountList((data as any).data.data);
              setResetSearchFlag(true);
              setSearch('');
            })
            .catch((error: any) => {
              toast.error(error.message);
            });
        })
        .catch((error: any) => {
          toast.error(error.message);
        });
    }
  };

  const handleNextPagination = (pageSize: any): void => {
    if (currentData > 0 && currentData > pageSize) {
      setPageValue(pageSize + 1);
    }
  };
  const handlePrevPagination = (pageSize: any): void => {
    if (pageSize > 1 && currentData >= pageSize) {
      setPageValue(pageSize - 1);
    }
  };

  // Add a new function to handle normal search
  const handleSearch = (value: string): void => {
    setSearch(value);
    setPageValue(defaultPage);
  };

  const handleSortByColumn = (column: string): void => {
    let newSortDirection = 'asc';

    if (column === sortColumn) {
      newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      newSortDirection = 'desc';
    }
    ApiUtils.getDiscountList(
      `&page=${pageValue}&page_size=${pageSize}&sort_column=${column}&sort_direction=${newSortDirection}&search=${search}`,
    )
      .then(async (data: any): Promise<void> => {
        setDiscountList(data?.data.data);
        setSortDirection(newSortDirection);
        setSortColumn(column);

        setTotalRecords(data?.data?.total);
      })
      .catch((error: any) => {
        toast.error(error.message);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Discount Name',
        accessor: 'name',
        disableFilters: true,
        filterable: true,
      },

      {
        Header: 'Discount',
        accessor: 'value',
        disableFilters: true,
        filterable: true,
      },

      {
        Header: 'Start Date',
        accessor: 'start_date',
        disableFilters: true,
        filterable: true,
      },
      {
        Header: 'Expiry Date',
        accessor: 'end_date',
        disableFilters: true,
        filterable: true,
      },
      {
        Header: 'Price Effect',
        accessor: 'price_effect',
        disableFilters: true,
        filterable: true,
        Cell: ({cell}: {cell: {value: number}}) => {
          const priceEffect = cell.value;
          const displayText =
            priceEffect === 37 ? 'Up' : priceEffect === 38 ? 'Down' : '';

          return <span>{displayText}</span>;
        },
      },
      {
        Header: 'Category Name',
        accessor: 'category_name',
        disableFilters: true,
        filterable: true,
      },
      {
        Header: 'Product Details',
        disableFilters: true,
        filterable: false,
        accessor: (cellProps: any) => {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const {product_name, option_name, option_value_name} = cellProps;

          // If product_name is missing, return just "-"
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (!product_name) {
            return <div>-</div>;
          }

          // Build the tree hierarchy only for available items
          const items = [product_name];
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (option_name) items.push(option_name);
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (option_value_name) items.push(option_value_name);

          return (
            <div>
              {items.map((item, index) => (
                <div key={index} style={{paddingLeft: `${index * 10}px`}}>
                  {index > 0 ? '└─ ' : ''}
                  {item}
                </div>
              ))}
            </div>
          );
        },
      },

      {
        Header: 'Status',
        accessor: 'status_id',
        disableFilters: true,
        filterable: false,
        Cell: ({cell}: {cell: {value: number}}) => {
          const isActive = cell.value === variables.DISCOUNT_ACTIVE_STATUS_ID;

          return (
            <span
              className={`badge text-uppercase ${
                isActive
                  ? 'bg-success-subtle text-success'
                  : 'bg-danger-subtle text-danger'
              }`}>
              {isActive
                ? variables.DISCOUNT_ACTIVE_STATUS
                : variables.DISCOUNT_INACTIVE_STATUS}
            </span>
          );
        },
      },
      {
        Header: 'Action',
        disableFilters: true,
        filterable: false,
        accessor: (cellProps: any) => {
          return (
            <Dropdown className="text-start">
              <Dropdown.Toggle className="btn btn-soft-secondary btn-sm btn-icon dropdown arrow-none">
                <i className="mdi mdi-dots-horizontal" />
              </Dropdown.Toggle>
              <Dropdown.Menu as="ul" className="dropdown-menu-end">
                <li>
                  <Dropdown.Item
                    onClick={() => {
                      isSetEditDiscount(false);
                      setEditDiscount(cellProps);
                      togAddDiscountsModals();
                    }}
                    className="remove-list">
                    <i className="ri-pencil-fill align-bottom me-2 text-muted" />
                    Edit
                  </Dropdown.Item>
                </li>

                <li>
                  <Dropdown.Item
                    onClick={async () => {
                      await handleDeleteDiscount(cellProps.id);
                    }}
                    className="remove-list">
                    <i className="ri-delete-bin-fill align-bottom me-2 text-muted" />
                    Delete
                  </Dropdown.Item>
                </li>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    [discountList],
  );

  const [modalAddDiscountsModals, setmodalAddCouponsModals] =
    useState<boolean>(false);
  function togAddDiscountsModals(): void {
    setmodalAddCouponsModals(!modalAddDiscountsModals);
  }

  return (
    <div className="page-content">
      <Container fluid={true}>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Price Up & Down</h4>
        </div>
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body>
                <TableContainer
                  columns={columns ?? []}
                  data={discountList ?? []}
                  handleNextPagination={handleNextPagination}
                  handlePrevPagination={handlePrevPagination}
                  pageValue={pageValue}
                  setPageSize={setPageSize}
                  iscustomPageSize={false}
                  isBordered={true}
                  customPageSize={10}
                  isGlobalFilter={true}
                  isAddOptions={true}
                  className="custom-header-css"
                  tableClass="table-centered align-middle table-nowrap mb-0"
                  theadClass="text-muted table-light"
                  SearchPlaceholder="Search Products..."
                  buttonText="Add  Price up & Down"
                  onClick={() => {
                    isSetAddDiscount(false);
                    isSetEditDiscount(false);
                    togAddDiscountsModals();
                    setEditDiscount({});
                  }}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  handleSortByColumn={handleSortByColumn}
                  onSearch={handleSearch}
                  resetSearchFlag={resetSearchFlag}
                  setResetSearchFlag={setResetSearchFlag}
                  isDownload={true}
                  isDownloadAPI={ApiUtils.ExportProductDiscount}
                  isImport={isImport}
                  setIsImport={setIsImport}
                />
                <div className="noresult" style={{display: 'none'}}>
                  <div className="text-center">
                    <h5 className="mt-2">Sorry! No Result Found</h5>
                    <p className="text-muted mb-0">
                      We've searched more than 150+ Orders We did not find any
                      orders for you search.
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <DiscountModal
          title={
            editDiscount?.id !== undefined
              ? 'Edit Price Up & Down'
              : 'Add Price Up & Down'
          }
          editDiscount={editDiscount}
          modalAddDiscountsModals={modalAddDiscountsModals}
          togAddDiscountsModals={togAddDiscountsModals}
          isSetEditDiscount={isSetEditDiscount}
          isSetAddDiscount={isSetAddDiscount}
        />
      </Container>
    </div>
  );
};

export default DiscountListing;
