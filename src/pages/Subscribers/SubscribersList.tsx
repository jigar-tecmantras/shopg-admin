import React, {useState, useMemo, useEffect} from 'react';
import {Card, Col, Container, Row, Button} from 'react-bootstrap';
import TableContainer from 'Common/TableContainer';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import Swal from 'sweetalert2';
interface SubscribeItemType {
  data: {
    data: [];
    total: number;
  };
  message: string;
}
const Subscribers = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.SUBSCRIBERS_LIST;
  const [subscriberList, setSubscribeList] = useState<
    SubscribeItemType | undefined
  >();
  // Removed edit/add state, only listing
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
        const data = await ApiUtils.getSubscribersList(
          `?page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
        );

        setSubscribeList(data as SubscribeItemType);
        setTotalRecords((data as SubscribeItemType)?.data?.total);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    void fetchData(); // Invoke the async function
  }, [pageValue, shouldFetch, search]);

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
    ApiUtils.getSubscribersList(
      `?page=${pageValue}&page_size=${pageSize}&sort_column=${column}&sort_direction=${newSortDirection}&search=${search}`,
    )
      .then(async (data: any): Promise<void> => {
        setSubscribeList(data as SubscribeItemType);
        setSortDirection(newSortDirection);
        setSortColumn(column);

        setTotalRecords((data as SubscribeItemType)?.data?.total);
      })
      .catch((error: any) => {
        toast.error(error.message);
      });
  };

  const handleDeleteProduct = async (id: any): Promise<void> => {
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
      ApiUtils.deleteSubscriber(id)
        // eslint-disable-next-line unused-imports/no-unused-vars
        .then(async data => {
          await Swal.fire({
            title: 'Deleted',
            text: (data as any).message,
            icon: 'success',
          });
          ApiUtils.getSubscribersList(
            `?page=${pageValue}&page_size=${pageSize}`,
          )
            .then(async (data: any) => {
              setSubscribeList(data);
            })
            .catch((error: any) => {
              toast.error(error.message);
            });
        })
        .catch((error: any) => {
          toast.error(error.message);
        });
      setResetSearchFlag(true);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Email',
        disableFilters: true,
        filterable: true,
        accessor: 'email',
        Cell: ({cell}: {cell: {value: string}}) => <div>{cell.value}</div>,
      },
      {
        Header: 'Created At',
        accessor: 'created_at',
        disableFilters: true,
        filterable: true,
        Cell: ({cell}: {cell: {value: string}}) => {
          const date =
            cell.value.length > 0
              ? cell.value.split(' ')[0].split('-').reverse().join('-')
              : '';
          return <div>{date}</div>;
        },
      },
      {
        Header: 'Action',

        disableFilters: true,
        filterable: false,
        Cell: (cellProps: any) => {
          return (
            <Button
              role="add-Btn"
              variant="danger"
              className="remove-list mx-2  text-light"
              onClick={async () => {
                await handleDeleteProduct(cellProps.row.original.id);
              }}>
              <i className="ri-delete-bin-fill align-bottom me-2 text-light" />
              Delete
            </Button>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="page-content">
      <Container fluid={true}>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Email Subscribers</h4>
        </div>
        <div id="couponsList">
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <TableContainer
                    columns={columns ?? []}
                    data={subscriberList?.data.data ?? []}
                    handleNextPagination={handleNextPagination}
                    handlePrevPagination={handlePrevPagination}
                    pageValue={pageValue}
                    iscustomPageSize={false}
                    isBordered={true}
                    customPageSize={pageSize}
                    isGlobalFilter={true}
                    pageSize={pageSize}
                    currentData={currentData}
                    setPageSize={setPageSize}
                    className="custom-header-css"
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder="Search Subscribers..."
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    handleSortByColumn={handleSortByColumn}
                    onSearch={handleSearch}
                    resetSearchFlag={resetSearchFlag}
                    setResetSearchFlag={setResetSearchFlag}
                    subscriberTotal={subscriberList?.data?.total ?? 0}
                    isDownload={true}
                    isDownloadAPI={ApiUtils.ExportSubscribers}
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
      </Container>
    </div>
  );
};

export default Subscribers;
