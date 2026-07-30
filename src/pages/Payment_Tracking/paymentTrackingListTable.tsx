import React, {useEffect, useMemo, useState} from 'react';
import {Card, Col, Dropdown, Row} from 'react-bootstrap';
import TableContainer from 'Common/TableContainer';

import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import PaymentDetailsModal from './paymentDetailModal';

interface PaymentData {
  data: {
    data:
      | Array<{
          id: number;
          order_id: number;
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
          message: string;
          status: number;
          refund_id: number;
          order_no: string;
        }>
      | undefined;
    page_size?: number;
    current_page?: number;
    total?: number;
  };
  message?: string;
}
const PaymentTrackingListTable = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.PAYMENT_TRACKING;

  const [paymentList, setPaymentList] = React.useState<
    PaymentData | undefined
  >();

  interface StatusData {
    id: number;
    name: string;
    // other properties
  }

  const defaultPage = 1;
  const [pageValue, setPageValue] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('id');

  const [sortDirection, setSortDirection] = useState('asc');
  const [searchOrderId, setSearchOrderId] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [shouldFetch, setShouldFetch] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(defaultPage);
  const currentData = Math.ceil(totalRecords / pageSize);

  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  useEffect(() => {
    void getUsersList();
  }, [pageValue, shouldFetch, search, searchOrderId]);

  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);

  // Fetch status data from the /get-status API
  useEffect(() => {
    const fetchStatusData = async (): Promise<void> => {
      try {
        const response: any = await ApiUtils.getStatus(`type=payment_type`);

        setStatusData(response.data);
      } catch (error) {
        toast.error('Error fetching status data');
      }
    };

    void fetchStatusData();
  }, []);
  async function getUsersList(): Promise<void> {
    try {
      const data = await ApiUtils.getPaymentTrackingList(
        `?page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}&order_id=${searchOrderId}`,
      );

      setPaymentList(data as PaymentData);
      setTotalRecords((data as PaymentData)?.data?.total ?? defaultPage);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const handleOrderIDSearch = (value: string): void => {
    setSearchOrderId(value);
  };

  // Add a new function to handle normal search
  const handleSearch = (value: string): void => {
    setSearch(value);
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
  const handleSortByColumn = async (column: string): Promise<void> => {
    try {
      let newSortDirection = 'asc';

      if (column === sortColumn) {
        newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        newSortDirection = 'desc';
      }
      const data = await ApiUtils.getPaymentTrackingList(
        `?page=${pageValue}&page_size=${pageSize}&sort_column=${column}&sort_direction=${newSortDirection}&search=${search}&order_id=${searchOrderId}`,
      );

      setSortDirection(newSortDirection);
      setSortColumn(column);

      setPaymentList(data as PaymentData);
      setTotalRecords((data as PaymentData)?.data?.total ?? defaultPage);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const columns = useMemo(
    () => [
      
      {
        Header: 'Order Number',
        disableFilters: true,
        filterable: true,
        accessor: 'order_no',
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },
      {
        Header: 'Juspay Txn ID',
        disableFilters: true,
        filterable: true,
        accessor: 'juspay_txn_id',
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },

      {
        Header: 'Juspay Order ID',
        disableFilters: true,
        filterable: true,
        accessor: 'juspay_order_id',
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },
      // {
      //   Header: 'Message',
      //   disableFilters: true,
      //   filterable: true,
      //   accessor: 'message',
      //   Cell: ({cell}: {cell: {value: string | null}}) => {
      //     return <div>{cell.value ?? '-'}</div>;
      //   },
      // },
      {
        Header: 'Status',
        disableFilters: true,
        filterable: true,
        accessor: 'status',
        Cell: ({cell}: {cell: {value: any}}) => {
          const statusId = cell.value;
          const statusName = statusData?.find(
            (status: any) => status.id === statusId,
          )?.name;

          return <div>{statusName ?? '-'}</div>;
        },
      },
      {
        Header: 'Juspay Payment Status',
        disableFilters: true,
        filterable: true,
        accessor: 'juspay_payment_status',
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },
      {
        Header: 'Refund ID',
        disableFilters: true,
        filterable: true,
        accessor: 'refund_id',
        Cell: ({cell}: {cell: {value: string | null}}) => {
          return <div>{cell.value ?? '-'}</div>;
        },
      },
      {
        Header: 'Action',
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          const handleViewClick = (): void => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions

            setSelectedPayment(cellProps); // Set the selected payment object
            setShowModal(true); // Show the modal
          };

          return (
            <Dropdown>
              <Dropdown.Toggle className="btn btn-soft-secondary btn-sm dropdown btn-icon arrow-none">
                <i className="ri-more-fill align-middle"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu as="ul" className="dropdown-menu-end">
                <li>
                  <Dropdown.Item
                    onClick={() => {
                      handleViewClick();
                    }}>
                    <i className="ri-eye-fill align-bottom me-2 text-muted" />{' '}
                    View Details
                  </Dropdown.Item>
                </li>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    [statusData],
  );

  return (
    <Row data-testid="payment-tracking">
      <Col lg={12}>
        <Card id="invoiceList">
          <Card.Body className="p-0">
            <div>
              <TableContainer
                columns={columns ?? []}
                data={paymentList?.data?.data ?? []}
                isGlobalFilter={true}
                handleNextPagination={handleNextPagination}
                handlePrevPagination={handlePrevPagination}
                pageValue={pageValue}
                iscustomPageSize={false}
                pageSize={pageSize}
                isSearchByID={true}
                isBordered={true}
                customPageSize={pageSize}
                currentData={currentData}
                setPageSize={setPageSize}
                className="custom-header-css"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder="Search Payments..."
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                handleSortByColumn={handleSortByColumn}
                onSearchByID={handleOrderIDSearch}
                onSearch={handleSearch}
              />
              <div className="noresult" style={{display: 'none'}}>
                <div className="text-center">
                  <h5 className="mt-2">Sorry! No Result Found</h5>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        <PaymentDetailsModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
          paymentId={selectedPayment}
        />
      </Col>
    </Row>
  );
};

export default PaymentTrackingListTable;
