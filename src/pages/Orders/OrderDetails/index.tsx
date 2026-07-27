/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, {useEffect, useState} from 'react';
import {Card, Col, Container, Row} from 'react-bootstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';

import OrderDetailsCard from './OrderDetailsCard';
import ModalContainer from 'Common/ModalContainer';
import OrderCancel from './OrderCancel';
import ApiUtils from 'api/ApiUtils';
import BreadCrumb from 'Common/BreadCrumb';
import {ORDER_STATUS} from 'Common/constants/layout';
import './statusTracking.css';
interface OrderDetailItemType {
  product_id: string;
  product_name: string;
  total_amount: number;
  qty: number;
  length: number;
  product_option_value: any;
  gst_tax_value: number;
  price: number;
  tax_amount: number;
  gift_from: string;
  gift_message: string;
  is_gift: any;
}
interface PaymentDetailItem {
  id: string;
  fee: number;
  tax: number;
  vpa: string | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  bank: {} | null;
  card: {
    id: string;
    emi: boolean;
    name: string;
    type: string;
    last4: string;
    entity: string;
    issuer: string | null;
    network: string;
    sub_type: string;
    token_iin: string | null;
    international: boolean;
  };
  email: string;
  notes: {
    address: string;
  };
  amount: number;
  entity: string;
  method: string;
  status: string;
  wallet: string | null;
  card_id: string;
  contact: string;
  captured: boolean;
  currency: string;
  order_id: string;
  created_at: number;
  error_code: string | null;
  error_step: string | null;
  invoice_id: string | null;
  description: string;
  error_reason: string | null;
  error_source: string | null;
  acquirer_data: {
    auth_code: string;
  };
  international: boolean;
  refund_status: string | null;
  amount_refunded: number;
  error_description: string | null;
}

interface OrderDetailType {
  created_at: string;
  order: {
    // customer_address: {
    //   customer_first_name: string;
    //   customer_last_name: string;
    //   phone_number: string;
    //   address_line_1: string;
    //   address_line_2: string;
    //   city_name: string;
    //   postcode: string;
    // };
    payment_type: number;
    payment_detail: PaymentDetailItem | string | unknown;
    // payment_detail: string;
    order_status: number | undefined;
    customer_address: {
      customer_first_name: string;
      customer_last_name: string;
      address_line_1: string;
      address_line_2: string;
      city_name: string;
      state_name: string;
      postcode: number;
      landmark: string;
      phone_number: number;
    };
    customer_address_id: string;
    same_as_customer_address: number;
    shipping_address: {
      address_line_1: string;
      address_line_2: string;
      city_name: string;
      state_name: string;
      postcode: number;
      landmark: string;
      phone_number: number;
    };
    shipping_address_id: string;
  };
  refund_id: string;
  customer_address_id: number;
  customer_id: number;
  id: number;
  // payment_type: number;
  total_amount: number;
  tax_amount: number;
  final_total_amount: number;
  coupon_amount: number;
  coupon_name: string;
  delivery_charge: any;
  order_no: number;
  product_id: string;
  product_option_value_id: string;
  product_name: string;
  qty: number;
  length: number;
  product_option_value: any;
  gst_tax_value: number;
  price: number;
  gift_from: string;
  gift_message: string;
  is_gift: any;
}
const OrderDetails = (): JSX.Element => {
  const {orderId} = useParams();
  const navigate = useNavigate();
  document.title = 'Order Overview | Warehouse';
  const [modalFlag, setModalFlag] = useState(false);
  const [modalFlag1, setModalFlag1] = useState(false);

  const [orderDetail, setOrderDetail] = useState<OrderDetailType | null>(null);

  // Check if payment_detail is a string and needs parsing
  const payDetail =
    typeof orderDetail?.order?.payment_detail === 'string'
      ? JSON.parse(orderDetail?.order?.payment_detail)
      : typeof orderDetail?.order?.payment_detail === 'object'
        ? orderDetail?.order?.payment_detail // If it's already an object, use it as is
        : null; // Handle other cases if necessary

  function modalToggle(): void {
    setModalFlag(!modalFlag);
  }
  useEffect(() => {
    if (orderId != null) {
      void getUsersList();
      void getStatusTraker();
    } else {
      navigate('/order-list');
    }
  }, []);
  async function getUsersList(): Promise<void> {
    try {
      const res: any = await ApiUtils.getOrderList(`?id=${orderId}`);
      setOrderDetail(res?.data as OrderDetailType);
    } catch (error: any) {
      // toast.error(error.message);
    }
  }
  const openGiftDetailsModal = (order: OrderDetailItemType): void => {
    // Update state or take any necessary action to open the modal
    // You can use the `setModalFlag` function or any other mechanism you have in place
    setModalFlag1(true);

    // You can also set additional modal-specific state to pass 'gift_from' and 'gift_message'
    // e.g., setGiftDetails({ giftFrom: order.gift_from, giftMessage: order.gift_message });
  };

  const [shipmentTrack, setshipmentTrack] = useState<any>();
  async function getStatusTraker(): Promise<void> {
    try {
      const res: any = await ApiUtils.shipmentTrackActivities(`/${orderId}`);
      const trackActivities = res.data?.track_url;
      setshipmentTrack(trackActivities);
    } catch (error: any) {
      // toast.error(error.message);
      console.log(error.message);
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  // const shipment_track_activities = [
  //   {
  //     date: '2021-12-23 14:23:18',
  //     status: 'X-PPOM',
  //     activity: 'In Transit - Shipment picked up',
  //     location: 'Palwal_NewColony_D (Haryana)',
  //     'sr-status': '42',
  //   },
  //   {
  //     date: '2021-12-23 14:19:37',
  //     status: 'FMPUR-101',
  //     activity: 'Manifested - Pickup scheduled',
  //     location: 'Palwal_NewColony_D (Haryana)',
  //     'sr-status': 'NA',
  //   },
  //   {
  //     date: '2021-12-23 14:19:34',
  //     status: 'X-UCI',
  //     activity: 'Manifested - Consignment Manifested',
  //     location: 'Palwal_NewColony_D (Haryana)',
  //     'sr-status': '5',
  //   },
  // ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatDate: any = (dateString: string) => {
    const date = new Date(dateString);

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    // Extract hours, minutes, and format time to 12-hour format
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

    // Format date as DD-MM-YYYY and time as 12-hour format
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  };
  return (
    <div className="page-content">
      <Container fluid={true}>
        <BreadCrumb
          title="Order Details"
          pageTitle="Order List"
          pageLink="/order-list"
        />
        <Row className="mb-4 align-items-center justify-content-between">
          <Col>
            <h6 className="fs-18 mb-0">
              Order ID: #
              {orderDetail?.order_no !== null
                ? orderDetail?.order_no
                : orderDetail?.id}
            </h6>
          </Col>
          <Col className="text-end me-3">
            {shipmentTrack && (
              <Link
                to={shipmentTrack}
                className="btn btn-primary"
                target="_blank">
                Track Order
              </Link>
            )}
          </Col>
        </Row>
        <Row>
          <Col xxl={8}>
            <Row>
              <OrderDetailsCard orderDetail={orderDetail?.order} />
            </Row>
            <Col xxl={12} sm={12}>
              <Card>
                <div className="card-body">
                  <div className="table-responsive table-card">
                    <table className="table table-bordered align-middle table-nowrap mb-0">
                      <thead className="text-muted table-light">
                        <tr>
                          <th scope="columnheader">Product ID</th>
                          <th scope="columnheader">Product Name</th>
                          <th scope="columnheader">Price</th>
                          <th scope="columnheader">Quantity</th>
                          <th scope="columnheader">Tax (%)</th>
                          <th scope="columnheader">Tax Value</th>
                          <th scope="columnheader">Gift</th>

                          <th
                            scope="columnheader"
                            className="text-center"
                            colSpan={3}>
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetail != null ? (
                          <tr>
                            <td className="scrollable-cell" role="cell">
                              <Link
                                to={`${process.env.REACT_APP_FRONTEND_URL}/product/${orderDetail?.product_id}?option=${orderDetail?.product_option_value_id}`}
                                className="fw-medium link-primary"
                                target="_blank">
                                #{orderDetail?.product_id}
                              </Link>
                            </td>
                            <td className="scrollable-cell" role="cell">
                              {orderDetail?.product_name}
                            </td>
                            <td className="scrollable-cell" role="cell">
                              ₹{orderDetail?.price}
                            </td>
                            <td className="scrollable-cell" role="cell">
                              {orderDetail?.qty}
                            </td>
                            <td className="scrollable-cell" role="cell">
                              {orderDetail?.gst_tax_value}%
                            </td>
                            <td className="scrollable-cell" role="cell">
                              ₹{orderDetail?.tax_amount}
                            </td>
                            <td className="scrollable-cell" role="cell">
                              {orderDetail?.is_gift === 23 ? (
                                <button
                                  className="btn btn-link"
                                  onClick={() => {
                                    openGiftDetailsModal(orderDetail);
                                  }}>
                                  Yes
                                </button>
                              ) : (
                                'No'
                              )}
                            </td>
                            <td className="text-end">
                              ₹
                              {Number(orderDetail?.price ?? 0) *
                                Number(orderDetail?.qty) +
                                Number(orderDetail?.tax_amount)}
                            </td>
                          </tr>
                        ) : (
                          ''
                        )}

                        <tr>
                          <td colSpan={4}></td>
                          <td colSpan={5} className="p-0">
                            <table className="table table-borderless mb-0">
                              <tbody>
                                <tr>
                                  <td>Sub Total Amount (Rs) :</td>
                                  <td className="text-end">
                                    ₹{' '}
                                    {Number(orderDetail?.price ?? 0) *
                                      Number(orderDetail?.qty ?? 0)}
                                  </td>
                                </tr>
                                <tr className="border-top">
                                  <td>Tax Value (Rs) :</td>
                                  <td className="text-end">
                                    ₹ {orderDetail?.tax_amount ?? 0}
                                  </td>
                                </tr>
                                {orderDetail?.coupon_amount ? (
                                  <tr>
                                    <td>Discount (Rs):</td>
                                    <td className="text-end">
                                      ₹{orderDetail?.coupon_amount}
                                    </td>
                                  </tr>
                                ) : (
                                  ''
                                )}
                                <tr className="border-top">
                                  <th>Shipping Charge (Rs) :</th>
                                  <th className="text-end">
                                    ₹
                                    {orderDetail?.delivery_charge
                                      ? orderDetail?.delivery_charge
                                      : 0}
                                  </th>
                                </tr>
                                <tr className="border-top">
                                  <th>Total (Rs) :</th>
                                  <th className="text-end">
                                    ₹ {orderDetail?.total_amount}
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </Col>
          </Col>
          {/* <Row> */}
          <Col xxl={4} sm={12}>
            <Card>
              <div className="card-header">
                <h5 className="card-title mb-0">Payment Detail:</h5>
              </div>
              <div className="card-body">
                {orderDetail?.order?.payment_type === 21 && (
                  <>
                    <strong> Payment Mode :</strong> Cash
                  </>
                )}
                <div className="table-responsive">
                  {orderDetail?.order?.payment_type === 21 ? (
                    ''
                  ) : (
                    <>
                      <table className="table table-sm table-borderless align-middle description-table mb-0">
                        <tbody>
                          {/* <tr>
                            <td>Transactions:</td>
                            <td>
                              <span className="fw-medium">{payDetail?.id}</span>
                            </td>
                          </tr> */}
                          <tr>
                            <td>Payment Method</td>
                            <td>
                              {payDetail?.content?.order?.payment_method_type}
                            </td>
                          </tr>
                          <tr>
                            <td>Card Number:</td>
                            <td>
                              {payDetail?.content?.order
                                ?.payment_method_type === 'CARD' && (
                                <span className="fw-medium">
                                  XXXX XXXX XXXX{' '}
                                  {
                                    payDetail?.content?.order?.card
                                      ?.last_four_digits
                                  }
                                </span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Card Holder Name</td>
                            <td>
                              <span className="fw-medium">
                                {' '}
                                {payDetail?.content?.order
                                  ?.payment_method_type === 'CARD' && (
                                  <span className="fw-medium">
                                    {payDetail?.content?.order?.card
                                      ?.name_on_card || 'No Name Available'}
                                  </span>
                                )}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>Total Amount</td>
                            <td>
                              <span className="fw-medium">
                                {
                                  // `₹${Number(payDetail?.amount) / 100}`}
                                  `₹${Number(orderDetail?.total_amount)}`
                                }
                              </span>
                            </td>
                          </tr>
                          {orderDetail?.refund_id !== null ? (
                            <tr>
                              <td>Refund Amount</td>
                              <td>
                                <span className="fw-medium">
                                  ₹{orderDetail?.total_amount}`
                                </span>
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </Col>
          {/* </Row> */}
          <Col xxl={6}>
            <Row>
              <Col lg={12}>
                <Card className="d-none">
                  <div className="card-header d-flex align-items-center">
                    <h5 className="card-title flex-grow-1 mb-0">
                      Logistics Details
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="text-center">
                      <i className="bi bi-truck fs-1"></i>
                      <h5 className="fs-18">Ecom Logistics</h5>
                      <p className="mb-0">
                        <strong>ID: </strong>MFDS1400457854
                      </p>
                      <p className="mb-0">
                        <strong> Payment Mode :</strong>{' '}
                        {orderDetail?.order?.payment_type === 21
                          ? 'Cash'
                          : orderDetail?.order?.payment_type === 22
                            ? 'Online Payment'
                            : 'N/A'}
                      </p>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col lg={12} className="d-none">
                <Card>
                  <div className="card-header ">
                    <h5 className="card-title mb-0">Order Status</h5>
                  </div>
                  <div className="card-body">
                    <div className="col-md-12 col-lg-12">
                      <div id="tracking-pre"></div>
                      <div id="tracking">
                        <div className="tracking-list">
                          {/* {shipmentTrack?.length > 0 ? (
                            shipment_track_activities.map(
                              (activity: any, index: any) => (
                                <div className="tracking-item" key={index}>
                                  <div className="tracking-icon status-intransit">
                                    <svg
                                      className="svg-inline--fa fa-circle fa-w-16"
                                      aria-hidden="true"
                                      data-prefix="fas"
                                      data-icon="circle"
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 512 512"
                                      data-fa-i2svg="">
                                      <path
                                        fill="currentColor"
                                        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                    </svg>
                                  </div>
                                  <div className="tracking-date">
                                    <img
                                      src="https://raw.githubusercontent.com/shajo/portfolio/a02c5579c3ebe185bb1fc085909c582bf5fad802/delivery.svg"
                                      className="img-responsive"
                                      alt="order-placed"
                                    />
                                  </div>
                                  <div className="tracking-content">
                                    {activity.activity} <br />
                                    <span>{activity.location}</span>
                                    <span>{formatDate(activity.date)}</span>
                                  </div>
                                </div>
                              ),
                            )
                          ) : (
                            <>
                              <div className="tracking-item">
                                <div className="tracking-icon status-intransit">
                                  <svg
                                    className="svg-inline--fa fa-circle fa-w-16"
                                    aria-hidden="true"
                                    data-prefix="fas"
                                    data-icon="circle"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    data-fa-i2svg="">
                                    <path
                                      fill="currentColor"
                                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                  </svg>
                                </div>
                                <div className="tracking-date">
                                  <img
                                    src="https://raw.githubusercontent.com/shajo/portfolio/a02c5579c3ebe185bb1fc085909c582bf5fad802/delivery.svg"
                                    className="img-responsive"
                                    alt="order-placed"
                                  />
                                </div>
                                <div className="tracking-content">
                                  PENDING <br />
                                  <span></span>
                                  <span></span>
                                </div>
                              </div>
                            </>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col lg={12} className="d-none">
            <Card id="track-order">
              <div className="card-header d-flex  align-items-center gap-3">
                <h5 className="card-title flex-grow-1 mb-0">Order Status</h5>
                <div className="flex-shrink-0"></div>
              </div>
              <div className="card-body">
                <Row className="justify-content-between">
                  {orderDetail?.order?.order_status !==
                  ORDER_STATUS.CANCELED ? (
                    <>
                      <Col
                        lg={2}
                        className={`order-tracking text-center ${
                          orderDetail?.order?.order_status ===
                            ORDER_STATUS.ACCEPTED || ORDER_STATUS.PENDING
                            ? 'completed'
                            : ''
                        }`}>
                        <span className="is-complete"></span>
                        <div className="card mt-3 mb-0">
                          <div className="card-body">
                            <h6 className="fs-17">Ordered</h6>
                          </div>
                        </div>
                      </Col>
                      <Col
                        lg={2}
                        className={`order-tracking text-center ${
                          orderDetail?.order?.order_status ===
                            ORDER_STATUS.ACCEPTED ||
                          orderDetail?.order?.order_status ===
                            ORDER_STATUS.ON_THE_WAY ||
                          orderDetail?.order?.order_status ===
                            ORDER_STATUS.DELIVERY_PERSON_ASSIGN ||
                          orderDetail?.order?.order_status ===
                            ORDER_STATUS.DELIVERED
                            ? 'completed'
                            : ''
                        }`}>
                        <span className="is-complete"></span>
                        <div className="card mt-3 mb-0">
                          <div className="card-body">
                            <h6 className="fs-17">Order Shipped</h6>
                          </div>
                        </div>
                      </Col>
                      <Col
                        lg={2}
                        className={`order-tracking text-center ${
                          orderDetail?.order?.order_status ===
                            ORDER_STATUS.ON_THE_WAY ||
                          orderDetail?.order?.order_status ===
                            ORDER_STATUS.DELIVERY_PERSON_ASSIGN ||
                          orderDetail?.order?.order_status ===
                            ORDER_STATUS.DELIVERED
                            ? 'completed'
                            : ''
                        }`}>
                        <span className="is-complete"></span>
                        <div className="card mt-3 mb-0">
                          <div className="card-body">
                            <h6 className="fs-17">In Transist</h6>
                          </div>
                        </div>
                      </Col>
                      <Col
                        lg={2}
                        className={`order-tracking text-center ${
                          orderDetail?.order?.order_status ===
                            ORDER_STATUS.DELIVERY_PERSON_ASSIGN ||
                          orderDetail?.order?.order_status ===
                            ORDER_STATUS.DELIVERED
                            ? 'completed'
                            : ''
                        }`}>
                        <span className="is-complete"></span>
                        <div className="card mt-3 mb-0">
                          <div className="card-body">
                            <h6 className="fs-17">Out For Delivery</h6>
                          </div>
                        </div>
                      </Col>
                      <Col
                        lg={2}
                        className={`order-tracking text-center ${
                          orderDetail?.order?.order_status ===
                          ORDER_STATUS.DELIVERED
                            ? 'completed'
                            : ''
                        }`}>
                        <span className="is-complete"></span>
                        <div className="card mt-3 mb-0">
                          <div className="card-body">
                            <h6 className="fs-17">Delivered</h6>
                          </div>
                        </div>
                      </Col>
                    </>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center text-danger fs-5 fw-semibold mt-4">
                      <span className="me-2">Order Canceled</span>
                      <span role="img" aria-label="sad-face">
                        😞
                      </span>
                    </div>
                  )}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
        <ModalContainer
          showModal={modalFlag}
          handleClose={modalToggle}
          modalTitle="Order Cancel Order"
          modalBody={<OrderCancel handleClose={modalToggle} />}
        />
        <ModalContainer
          showModal={modalFlag1}
          handleClose={() => {
            setModalFlag1(false);
          }}
          modalTitle="Gift Details"
          modalBody={
            orderDetail != null ? (
              <div>
                {orderDetail.is_gift !== null && (
                  <>
                    <p>Gift From: {orderDetail.gift_from}</p>
                    <p>Gift Message: {orderDetail.gift_message}</p>
                  </>
                )}
              </div>
            ) : (
              <p>No gift details available.</p>
            )
          }
        />
      </Container>
    </div>
  );
};

export default OrderDetails;
