import React, {useMemo, useState, useEffect} from 'react';

import {Dropdown} from 'react-bootstrap';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
import OrderTableContainer from './OrderTableContainer';
import {ORDER_STATUS_VALUE} from 'Common/constants/layout';
import OrderStatusModal from './StatusModal';
import DeliveryPersonAssignModal from './DeliveryPersonAssignModal';
import {useLocation} from 'react-router-dom';
interface OrderListType {
  id: number;
  order: {
    id: number;
    customer_id: string;
    created_at: string;
    order_status: string;
    payment_type: string;
    final_total_amount: number;
    customer_address: {
      city_name: string;
      customer_first_name: string;
      customer_last_name: string;
      phone_number: string;
      state_name: string;
      customer_fullname: string;
      customer_email: string;
    };
  };
  order_no: number;
  order_status: string;
  order_status_id: number;
  // customer_address: {
  //   customer_first_name: string;
  //   customer_last_name: string;
  //   city_name: string;
  //   phone_number: string;
  // };
  // customer_id: string;
  total_amount: number;
  // order_status: string;
  // payment_type: string;
}
const OrderListTable = (): JSX.Element => {
  const [orderList, setOrderList] = React.useState<OrderListType[] | null>(
    null,
  );
  const location = useLocation();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');

  const [orderDetails, setOrderDetails] = useState<any>({});

  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  const defaultPage = 1;

  const [pageValue, setPageValue] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('id');
  const [search, setSearch] = useState<string>('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [totalRecords, setTotalRecords] = useState<number>(defaultPage);
  const currentData = Math.ceil(totalRecords / pageSize);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string | ''>(
    status ?? '',
  );
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<number | ''>('');
  const [deliveryPersonId, setDeliveryPersonId] = useState<number | ''>('');
  const [shouldFetch, setShouldFetch] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  useEffect(() => {
    void getUsersList();
  }, [
    pageValue,
    // pageSize,
    shouldFetch,
    orderStatusFilter,
    paymentTypeFilter,
    isStatusUpdated,
    deliveryPersonId,
    search,
  ]);

  async function getUsersList(): Promise<void> {
    try {
      const res = await ApiUtils.getOrderList(
        `?sort_direction=desc&page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&order_status=${orderStatusFilter}&payment_type=${paymentTypeFilter}&delivery_person_id=${deliveryPersonId}&search=${search}`,
      );

      const mappedData = (res as any)?.data?.data?.map(
        (order: OrderListType) => {
          return {
            id: order?.id,
            customer_id: order?.order?.customer_id,
            city_name: order?.order?.customer_address?.city_name,
            final_total_amount: order?.total_amount,
            order_status: order?.order_status,
            phone_number: order?.order?.customer_address?.phone_number,
            order_date: order?.order?.created_at.split(' ')[0],
            payment_type: order?.order?.payment_type,
            delivery_person: order?.order,
            order_number: order?.order_no,
            order_status_id: order?.order?.order_status,
            customer_fullname:
              order?.order?.customer_address !== null
                ? order?.order?.customer_address?.customer_first_name +
                  ' ' +
                  order?.order?.customer_address?.customer_last_name
                : '-',
            customer_email: order?.order?.customer_address?.customer_email,
            state_name: order?.order?.customer_address?.state_name,
          };
        },
      );
      // console.log(mappedData, 'response');
      setOrderList(mappedData);
      setTotalRecords((res as any)?.data?.total ?? defaultPage);
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  const handleOrderStatusFilter = (orderId: any): void => {
    setOrderStatusFilter(orderId);
  };
  const handlePaymentTypeFilter = (paymentId: any): void => {
    setPaymentTypeFilter(paymentId);
  };
  const handleDeleverySelect = (data: any): void => {
    setDeliveryPersonId(data);
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
  const handleDeleteOrder = (): void => {
    void Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result: any) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (result.isConfirmed) {
        void Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      }
    });
  };

  const handleSortByColumn = async (column: string): Promise<void> => {
    try {
      let newSortDirection = 'asc';

      if (column === sortColumn) {
        newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        newSortDirection = 'desc';
      }

      const response: any = await ApiUtils.getOrderList(
        `?page=${pageValue}&page_size=${pageSize}&sort_column=${column}&sort_direction=${newSortDirection}&order_status=${orderStatusFilter}&payment_type=${paymentTypeFilter}&search=${search}`,
      );

      const mappedData = response?.data?.data?.map((order: OrderListType) => {
        return {
          id: order?.id,
          customer_id: order?.order?.customer_id,
          city_name: order?.order?.customer_address?.city_name,
          final_total_amount: order?.total_amount,
          order_status: order?.order_status,
          phone_number: order?.order?.customer_address?.phone_number,
          order_date: order?.order?.created_at.split(' ')[0],
          payment_type: order?.order?.payment_type,
          order_number: order?.order_no,
          order_status_id: order?.order?.order_status,
          customer_fullname:
            order?.order?.customer_address !== null
              ? order?.order?.customer_address?.customer_first_name +
                ' ' +
                order?.order?.customer_address?.customer_last_name
              : '-',
          customer_email: order?.order?.customer_address?.customer_email,
          state_name: order?.order?.customer_address?.state_name,
        };
      });

      setSortDirection(newSortDirection);
      setOrderList(mappedData);
      setSortColumn(column);

      setTotalRecords(response?.data?.total ?? defaultPage);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const [deliveryModal, setDeliveryModal] = useState(false);
  const [orderIdforDelivery, setOrderIdForDelivery] = useState();

  const handleAssignDelivery = (data: any): any => {
    setDeliveryModal(!deliveryModal);
    setOrderIdForDelivery(data);
  };

  const cancelOrder = async (cellProps: any): Promise<void> => {
    void Swal.fire({
      title: 'Are you sure?',
      text: 'Want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    }).then(async (result: any) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (result.isConfirmed) {
        try {
          // Set the cancelling order ID to show loading state
          setCancellingOrderId(cellProps.order_number);

          const res: any = await ApiUtils.cancelOrder(
            `/${cellProps.order_number}`,
          );
          toast.success(res.message);

          // Show loader for 3 seconds after successful API call
          const loader: HTMLElement | null =
            document.getElementById('cover-spin');
          if (loader !== null) {
            loader.style.display = 'block';
          }

          // Show info toast about the loader
          toast.info('Processing cancellation, please wait...', {
            autoClose: 3000,
          });

          // Hide loader after 3 seconds and refresh the page
          setTimeout(() => {
            if (loader !== null) {
              loader.style.display = 'none';
            }
            // Clear the cancelling order ID
            setCancellingOrderId(null);
            // Refresh the entire page after loader is hidden
            window.location.reload();
          }, 3000);
        } catch (error: any) {
          // Clear the cancelling order ID on error
          setCancellingOrderId(null);
          toast.error(error.message);
        }
      }
    });
  };
  const [invoiceUrl, setInvoiceUrl] = useState<any>(null);

  const downloadInvoice = async (cellProps: any): Promise<void> => {
    try {
      const res: any = await ApiUtils.downloadShiprocketInvoice(
        `/${cellProps.order_number}`,
      );

      const invoiceURL = res.data?.invoice_url;
      // setInvoiceUrl(invoiceURL);

      // toast.success(res.message);
      if (invoiceURL !== undefined) {
        setInvoiceUrl(invoiceURL);
        toast.success(res.message);
      } else {
        toast.error('Invoice not available');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error.message);
    }
  };

  const shiprocketTracker = async (cellProps: any): Promise<void> => {
    try {
      const res: any = await ApiUtils.shiprocketOrderUrl(
        `/${cellProps.order_number}`,
      );

      const shiprocketOrderUrl = res.data?.url;

      // toast.success(res.message);
      if (shiprocketOrderUrl !== '') {
        window.open(shiprocketOrderUrl, '_blank', 'noopener,noreferrer');
        toast.success(res.message);
      } else {
        toast.error('Ship order URL not available');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (invoiceUrl != null) {
      // Automatically navigate to the PDF URL to download it
      window.location.href = invoiceUrl;
    }
  }, [invoiceUrl]);
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        disableFilters: true,
        filterable: true,
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },

      {
        Header: 'Order Number',
        accessor: 'order_number',
        disableFilters: true,
        filterable: true,
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },
      {
        Header: 'Customer Name',
        accessor: 'customer_fullname',
        disableFilters: true,
        filterable: true,
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
        },
      },
      {
        Header: 'Customer Email',
        accessor: 'customer_email',
        disableFilters: true,
        filterable: true,
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
        },
      },
      {
        Header: 'Customer Phone Number',
        accessor: 'phone_number',
        disableFilters: true,
        filterable: true,
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
        },
      },
      {
        Header: 'Date',
        accessor: 'order_date',
        disableFilters: true,
        filterable: true,
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },
      {
        Header: 'City Name',
        accessor: 'city_name',
        disableFilters: true,
        filterable: true,
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },
      {
        Header: 'State Name',
        accessor: 'state_name',
        disableFilters: true,
        filterable: true,
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
        },
      },
      {
        Header: 'Total Amount',
        accessor: 'final_total_amount',
        disableFilters: true,
        filterable: true,
        Cell: ({cell}: {cell: {value: string}}) => {
          return <div>{cell.value}</div>;
        },
      },
      {
        Header: 'Payment Method',
        accessor: 'payment_type',
        disableFilters: true,
        filterable: true,
        Cell: (cellProps: any) => {
          switch (cellProps?.value) {
            case 21:
              return (
                <span className="badge bg-success-subtle text-success text-uppercase">
                  {' '}
                  Cash
                </span>
              );
            case 22:
              return (
                <span className="badge bg-primary-subtle text-primary text-uppercase">
                  Online Payment
                </span>
              );
            default:
              return (
                <span className="badge bg-danger-subtle text-danger text-uppercase">
                  NA
                </span>
              );
          }
        },
      },
      {
        Header: 'Order Status',
        accessor: 'order_status',

        disableFilters: true,
        filterable: true,
        Cell: (cellProps: any) => {
          switch (cellProps?.value) {
            case ORDER_STATUS_VALUE.PENDING:
              return (
                <span className="badge bg-warning-subtle text-warning text-uppercase">
                  {' '}
                  {/* Pending */}
                  {cellProps?.value}
                </span>
              );
            case ORDER_STATUS_VALUE.ACCEPTED:
              return (
                <span className="badge bg-success-subtle text-success text-uppercase">
                  {/* Accepted */}
                  {cellProps?.value}
                </span>
              );
            case ORDER_STATUS_VALUE.DELIVERY_PERSON_ASSIGN:
              return (
                <span className="badge bg-info-subtle text-info text-uppercase">
                  {/* Delivery Person Assigned */}
                  {cellProps?.value}
                </span>
              );
            case ORDER_STATUS_VALUE.DELIVERED:
              return (
                <span className="badge bg-success-subtle text-success text-uppercase">
                  {/* Delivered */}
                  {cellProps?.value}
                </span>
              );
            case ORDER_STATUS_VALUE.ON_THE_WAY:
              return (
                <span className="badge bg-secondary-subtle text-secondary text-uppercase">
                  {/* Delivered */} {cellProps?.value}
                </span>
              );
            case ORDER_STATUS_VALUE.CANCELED:
              return (
                <span className="badge bg-danger-subtle text-danger text-uppercase">
                  {/* Canceled */}
                  {cellProps?.value}
                </span>
              );
            default:
              return (
                <span className="badge bg-danger-subtle text-danger text-uppercase">
                  {/* NA */}
                  {cellProps?.value}
                </span>
              );
          }
        },
      },
      // {
      //   Header: 'Delivery Person',
      //   accessor: 'delivery_person',
      //   disableFilters: true,
      //   filterable: true,
      //   Cell: (cellProps: any) => {
      //     const rowData = cellProps.row.original;
      //     return (
      //       <div className="ml-auto">
      //         {rowData.order_status === ORDER_STATUS.ACCEPTED ? (
      //           <button
      //             onClick={() => {
      //               handleAssignDelivery(rowData.id);
      //             }}
      //             className="btn btn-primary btn-sm">
      //             Assign Delivery Person
      //           </button>
      //         ) : rowData.order_status ===
      //             ORDER_STATUS.DELIVERY_PERSON_ASSIGN ||
      //           rowData.order_status === ORDER_STATUS.DELIVERED ||
      //           rowData.order_status === ORDER_STATUS.ON_THE_WAY ? (
      //           <div className="d-flex gap-2 align-items-center">
      //             <img
      //               src={rowData?.delivery_person?.delivery_person_image}
      //               alt="Delivery Person"
      //               className="rounded-circle mr-2"
      //               style={{width: '40px', height: '40px'}}
      //             />
      //             <span>
      //               {rowData?.delivery_person?.delivery_person_first_name}{' '}
      //               {rowData?.delivery_person?.delivery_person_last_name}
      //             </span>
      //           </div>
      //         ) : (
      //           <div className="text-center"> - </div>
      //         )}
      //       </div>
      //     );
      //   },
      // },
      {
        Header: 'Action',
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          // console.log(cellProps, 'cellProps in order list table');
          // const rowData = cellProps.row.original;

          return (
            <Dropdown className="text-center">
              <Dropdown.Toggle className="btn btn-soft-secondary btn-sm btn-icon dropdown arrow-none">
                <i className="mdi mdi-dots-horizontal" />
              </Dropdown.Toggle>
              <Dropdown.Menu as="ul" className="dropdown-menu-end">
                <li>
                  <Dropdown.Item
                    href={`/order-detail/${
                      cellProps.order_number !== null
                        ? cellProps.order_number
                        : cellProps.id
                    }`}>
                    <i className="ri-eye-fill align-bottom me-2 text-muted" />{' '}
                    View Order
                  </Dropdown.Item>
                </li>
                <li className="d-none">
                  <Dropdown.Item
                    href={`/order-invoice-detail/${
                      cellProps.order_number !== null
                        ? cellProps.order_number
                        : cellProps.id
                    }`}>
                    <i className="ri-eye-fill align-bottom me-2 text-muted" />{' '}
                    View Invoice
                  </Dropdown.Item>
                </li>
                {Boolean(cellProps?.order_status_id) &&
                  cellProps.order_status !== 'DELIVERED' &&
                  cellProps.order_status !== 'CANCELED' && (
                    <li>
                      <Dropdown.Item
                        className="remove-list"
                        onClick={async () => {
                          await shiprocketTracker(cellProps);
                        }}>
                        <i className="ri-truck-fill align-bottom me-2 text-muted" />{' '}
                        Ship Order
                      </Dropdown.Item>
                    </li>
                  )}
                {Boolean(cellProps?.order_status_id) &&
                  cellProps.order_status !== 'CANCELED' && (
                    <li>
                      <Dropdown.Item
                        className="remove-list"
                        onClick={async () => {
                          await downloadInvoice(cellProps);
                        }}>
                        <i className="ri-file-download-fill align-bottom me-2 text-muted" />
                        Invoice Download
                      </Dropdown.Item>
                    </li>
                  )}
                {Boolean(cellProps?.order_status_id) &&
                  cellProps.order_status !== 'CANCELED' &&
                  cellProps.order_status !== 'DELIVERED' && (
                    <li>
                      <Dropdown.Item
                        className="remove-list"
                        onClick={async () => {
                          await cancelOrder(cellProps);
                        }}
                        disabled={cancellingOrderId === cellProps.order_number}>
                        <i className="ri-close-circle-fill align-bottom me-2 text-muted" />
                        {cancellingOrderId === cellProps.order_number ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            />
                            Cancelling...
                          </>
                        ) : (
                          'Cancel Order'
                        )}
                      </Dropdown.Item>
                    </li>
                  )}
                <li className="d-none">
                  <Dropdown.Item
                    onClick={async () => {
                      setOrderDetails(cellProps);
                      toogleStatus();
                      setIsStatusUpdated(false);
                    }}
                    href="#"
                    className="remove-list">
                    <i className="ri-pencil-fill align-bottom me-2 text-muted" />
                    Update Order
                  </Dropdown.Item>
                </li>
                <li className="d-none">
                  <Dropdown.Item
                    onClick={handleDeleteOrder}
                    href="#"
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
  const [statusModal, setStatusModal] = useState(false);

  function toogleStatus(): void {
    setStatusModal(!statusModal);
  }

  const handleSearch = (value: string): void => {
    setSearch(value);
  };

  return (
    <>
      <OrderTableContainer
        columns={columns}
        data={orderList ?? []}
        isGlobalFilter={true}
        handleNextPagination={handleNextPagination}
        handlePrevPagination={handlePrevPagination}
        pageValue={pageValue}
        iscustomPageSize={false}
        isBordered={true}
        customPageSize={pageSize}
        pageSize={pageSize}
        currentData={currentData}
        setPageSize={setPageSize}
        className="custom-header-css"
        tableClass="table-centered align-middle table-nowrap mb-0"
        theadClass="text-muted table-light"
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSortByColumn={handleSortByColumn}
        handleOrderStatusFilter={handleOrderStatusFilter}
        handlePaymentTypeFilter={handlePaymentTypeFilter}
        setOrderStatusFilter={setOrderStatusFilter}
        handleDeleverySelect={handleDeleverySelect}
        SearchPlaceholder="Search Order Number..."
        onSearch={handleSearch}
        isDownload={true}
        isDownloadAPI={ApiUtils.ExportOrder}
      />
      <OrderStatusModal
        toogleStatus={toogleStatus}
        details={orderDetails}
        showModal={statusModal}
        setIsStatusUpdated={setIsStatusUpdated}
      />
      <DeliveryPersonAssignModal
        toogleStatus={handleAssignDelivery}
        details={orderIdforDelivery}
        showModal={deliveryModal}
        setIsStatusUpdated={setIsStatusUpdated}
      />
    </>
  );
};

export default OrderListTable;
