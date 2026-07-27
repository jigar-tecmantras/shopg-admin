import React, {useState, useMemo, useEffect} from 'react';
import {Card, Col, Container, Dropdown, Row} from 'react-bootstrap';
import TableContainer from 'Common/TableContainer';
import AddHSnModal from './AddHSnModal';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import Swal from 'sweetalert2';
interface HsnItemType {
  data: {
    data: [];
    total: number;
  };
  message: string;
}
const HsnComp = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.HSN_CODE;
  const [hsnList, seHsnList] = useState<HsnItemType | undefined>();
  const [edit, setEdit] = useState({});
  const [isEditHsn, setEditHsn] = useState(false);
  const [iseAddHsn, setAddHsn] = useState(false);
  const defaultPage = 1;
  const [pageValue, setPageValue] = useState(defaultPage);
  const [sortColumn, setSortColumn] = useState('id');
  const [shouldFetch, setShouldFetch] = useState(false);

  const [search, setSearch] = useState<string>('');
  const [resetSearchFlag, setResetSearchFlag] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(defaultPage);
  const currentData = Math.ceil(totalRecords / pageSize);

  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data = await ApiUtils.getHSNList(
          `?page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
        );

        seHsnList(data as HsnItemType);
        setTotalRecords((data as HsnItemType)?.data?.total);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    void fetchData(); // Invoke the async function
  }, [isEditHsn, iseAddHsn, pageValue, shouldFetch, search]);

  const handleDeleteHsn = async (id: any): Promise<void> => {
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
      ApiUtils.deleteHSN(id)
        // eslint-disable-next-line unused-imports/no-unused-vars
        .then(async data => {
          await Swal.fire({
            title: 'Deleted!',
            text: (data as any).message,
            icon: 'success',
          });
          ApiUtils.getHSNList(`?page=${pageValue}&page_size=${pageSize}`)
            .then(data => {
              seHsnList(data as HsnItemType);
            })
            .catch((error: any) => {
              toast.error(error.message);
            });
        })
        .catch((error: any) => {
          void Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.message,
            icon: 'error',
          });
        });
      setResetSearchFlag(true);
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
    ApiUtils.getHSNList(
      `?page=${pageValue}&page_size=${pageSize}&sort_column=${column}&sort_direction=${newSortDirection}&search=${search}`,
    )
      .then(async (data: any): Promise<void> => {
        seHsnList(data as HsnItemType);
        setSortDirection(newSortDirection);
        setSortColumn(column);

        setTotalRecords((data as HsnItemType)?.data?.total);
      })
      .catch((error: any) => {
        toast.error(error.message);
      });
  };
  const columns = useMemo(
    () => [
      {
        Header: 'GST Tax',
        disableFilters: true,
        filterable: true,
        accessor: 'value', // Assuming 'discount' is the property in your data for the discount value
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },
      {
        Header: 'Title',
        accessor: 'name',
        disableFilters: true,
        filterable: true,
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },
      {
        Header: 'Code',
        accessor: 'hsn_code',
        disableFilters: true,
        filterable: true,
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },

      {
        Header: 'Action',
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <Dropdown className="text-start">
              <Dropdown.Toggle className="btn btn-ghost-primary btn-icon btn-sm arrow-none">
                <i className="mdi mdi-dots-horizontal" />
              </Dropdown.Toggle>
              <Dropdown.Menu as="ul" className="dropdown-menu-end">
                <li>
                  <Dropdown.Item
                    onClick={() => {
                      setEdit(cellProps);
                      togAddCouponsModals();
                    }}>
                    <i className="ri-pencil-fill align-bottom me-2 text-muted" />{' '}
                    Edit
                  </Dropdown.Item>
                </li>
                <li>
                  <Dropdown.Item
                    onClick={async () => {
                      await handleDeleteHsn(cellProps?.id);
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
    [],
  );

  const [modalAddCouponsModals, setmodalAddCouponsModals] =
    useState<boolean>(false);
  function togAddCouponsModals(): void {
    setmodalAddCouponsModals(!modalAddCouponsModals);
  }

  return (
    <div className="page-content">
      <Container fluid={true}>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">GST Tax</h4>
        </div>
        <div id="couponsList">
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <TableContainer
                    columns={columns ?? []}
                    data={hsnList?.data.data ?? []}
                    handleNextPagination={handleNextPagination}
                    handlePrevPagination={handlePrevPagination}
                    pageValue={pageValue}
                    iscustomPageSize={false}
                    isBordered={true}
                    customPageSize={pageSize}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    pageSize={pageSize}
                    currentData={currentData}
                    setPageSize={setPageSize}
                    className="custom-header-css"
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder="Search GST Tax..."
                    buttonText="Add Tax Code"
                    onClick={() => {
                      togAddCouponsModals();
                      setEdit({});
                    }}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    handleSortByColumn={handleSortByColumn}
                    onSearch={handleSearch}
                    resetSearchFlag={resetSearchFlag}
                    setResetSearchFlag={setResetSearchFlag}
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
        </div>
        <AddHSnModal
          modalAddCouponsModals={modalAddCouponsModals}
          togAddCouponsModals={togAddCouponsModals}
          edit={edit}
          setEditHsn={setEditHsn}
          setAddHsn={setAddHsn}
        />
      </Container>
    </div>
  );
};

export default HsnComp;
