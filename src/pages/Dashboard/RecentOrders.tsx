import TableContainer from 'Common/TableContainer';
import React, {useEffect, useMemo, useState} from 'react';
import {Card, Col, Dropdown} from 'react-bootstrap';

import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {ORDER_STATUS_VALUE} from 'Common/constants/layout';
import Swal from 'sweetalert2';

const RecentOrders = (): any => {
  const [recentOrderData, setRecentOrderData] = useState([]);
  const fetchRecentOrders = async (): Promise<void> => {
    try {
      const resp: any = await ApiUtils.getRecentOrders();
      const firstFiveOrders = resp.data.data.slice(0, 5);
      setRecentOrderData(firstFiveOrders);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    void fetchRecentOrders();
  }, []);

  const recentOrders = recentOrderData?.map((order: any) => ({
    id: order?.id,
    customer_id: order?.order?.customer_id,
    city_name: order?.order?.customer_address?.city_name,
    final_total_amount: order?.order?.final_total_amount,
    order_status: order?.order_status,
    phone_number: order?.order?.customer_address?.phone_number,
    customer_fullname:
      order?.order?.customer_address !== null
        ? order?.order?.customer_address?.customer_first_name +
          ' ' +
          order?.order?.customer_address?.customer_last_name
        : '-',
    customer_email: order?.order?.customer_address?.customer_email,
    order_date: order?.order?.created_at.split(' ')[0],
    payment_type: order?.order?.payment_type,
    order_number: order?.order_no,
    state_name: order?.order?.customer_address?.state_name,
  }));

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
          const res: any = await ApiUtils.cancelOrder(
            `/${cellProps.order_number}`,
          );
          toast.success(res.message);
          await fetchRecentOrders();
        } catch (error: any) {
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
      const invoiceURL: any = res.data?.invoice_url;
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
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        disableFilters: true,
        filterable: true,
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
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
          return <div>{cell.value !== undefined ? cell.value : '-'}</div>;
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
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
        },
      },
      {
        Header: 'City Name',
        accessor: 'city_name',
        disableFilters: true,
        filterable: true,
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
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
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
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
                <span className="badge bg-danger-subtle text-danger text-uppercase">
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
        Header: 'Status',
        accessor: 'order_status',
        disableFilters: true,
        filterable: true,
        Cell: (cellProps: any) => {
          switch (cellProps?.value) {
            case ORDER_STATUS_VALUE.PENDING:
              return (
                <span className="badge bg-warning-subtle text-warning text-uppercase">
                  {' '}
                  {cellProps?.value}
                </span>
              );
            case ORDER_STATUS_VALUE.ACCEPTED:
              return (
                <span className="badge bg-success-subtle text-success text-uppercase">
                  {cellProps?.value}
                </span>
              );
            case ORDER_STATUS_VALUE.DELIVERY_PERSON_ASSIGN:
              return (
                <span className="badge bg-info-subtle text-info text-uppercase">
                  {cellProps?.value}
                </span>
              );
            case ORDER_STATUS_VALUE.DELIVERED:
              return (
                <span className="badge bg-secondary-subtle text-secondary text-uppercase">
                  {cellProps?.value}
                </span>
              );
            case ORDER_STATUS_VALUE.ON_THE_WAY:
              return (
                <span className="badge bg-secondary-subtle text-secondary text-uppercase">
                  {cellProps?.value}
                </span>
              );
            case ORDER_STATUS_VALUE.CANCELED:
              return (
                <span className="badge bg-danger-subtle text-danger text-uppercase">
                  {cellProps?.value}
                </span>
              );
            default:
              return (
                <span className="badge bg-danger-subtle text-danger text-uppercase">
                  {cellProps?.value}
                </span>
              );
          }
        },
      },

      {
        Header: 'Action',
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
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
                <li>
                  <Dropdown.Item
                    className="remove-list"
                    onClick={async () => {
                      await cancelOrder(cellProps);
                    }}>
                    <i className="ri-close-circle-fill align-bottom me-2 text-muted" />
                    Cancel Order
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

  return (
    <Col xxl={12}>
      <Card>
        <Card.Header className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Recent Orders</h4>
        </Card.Header>

        <TableContainer
          columns={columns}
          data={recentOrders}
          customPageSize={5}
          pageValue={1}
          className="custom-header-css table-card"
          tableClass="table-centered align-middle table-nowrap mb-0"
          theadClass="text-muted table-light"
          SearchPlaceholder="Search Order..."
          isNotPagination={true}
        />
      </Card>
    </Col>
  );
};

export default RecentOrders;
