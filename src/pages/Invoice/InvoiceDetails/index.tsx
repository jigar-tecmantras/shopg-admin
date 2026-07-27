import React, {useEffect, useState} from 'react';
import {Card, Col, Container, Row, Table} from 'react-bootstrap';
import Breadcrumb from 'Common/BreadCrumb';

// Import Images
import logoDark from 'assets/images/logo-dark.png';
import logoLight from 'assets/images/logo-light.png';
import {Link, useParams} from 'react-router-dom';
// import html2pdfLib from 'html2pdf.js';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import ApiUtils from 'api/ApiUtils';
import moment from 'moment';

const InvoiceDetails = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.INVOICE_DETAILS;

  const {id} = useParams();
  const [invoiceData, setInvoiceData]: any = useState([]);

  const fetchInvoiceDetails = async (): Promise<void> => {
    try {
      const res: any = await ApiUtils.getOrderList(`?id=${id}`);
      setInvoiceData(res.data);
    } catch (error: any) {
      // toast.error(error.message);
    }
  };

  useEffect(() => {
    void fetchInvoiceDetails();
  }, []);

  // Print the Invoice
  const printInvoice = (): void => {
    window.print();
  };

  // const downloadInvoice = (invoiceNumber: number): void => {
  //   const capcture: any = document.getElementById('downloadInvoice');
  //   void html2canvas(capcture, {scale: 3}).then(canvas => {
  //     const imageData = canvas.toDataURL('img/png');
  //     // eslint-disable-next-line new-cap
  //     const doc = new jsPDF('p', 'mm', 'a4', true);
  //     const componentWidth = doc.internal.pageSize.getWidth() + 10;
  //     const componentHeignt = doc.internal.pageSize.getHeight() + 10;
  //     doc.addImage(imageData, 'PNG', 0, 0, componentWidth, componentHeignt);
  //     doc.save(`invoice#${invoiceNumber}.pdf`);
  //   });
  // };

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumb
          title="Invoice Details"
          pageTitle="Order List"
          pageLink="/order-list"
        />

        <Row className="justify-content-center " id="downloadInvoice">
          <Col xxl={9}>
            <Card id="demo">
              <Row>
                <Col lg={12}>
                  <Card.Header className="border-bottom-dashed p-2">
                    <div className="d-sm-flex">
                      <div className="flex-grow-1">
                        <img
                          src={logoDark}
                          className="card-logo card-logo-dark"
                          alt="logo dark"
                          height="26"
                        />
                        <img
                          src={logoLight}
                          className="card-logo card-logo-light"
                          alt="logo light"
                          height="26"
                        />
                      </div>
                      <div className="flex-shrink-0 mt-sm-0 mt-3">
                        <h6>
                          <span className="text-muted fw-normal">
                            Legal Registration No:
                          </span>{' '}
                          <span id="legal-register-no">987654</span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">Email:</span>{' '}
                          <span id="email">toner@themesbrand.com</span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">Website:</span>{' '}
                          <Link
                            to="https://themesbrand.com/"
                            className="link-primary"
                            target="_blank"
                            id="website">
                            www.themesbrand.com
                          </Link>
                        </h6>
                        <h6 className="mb-0">
                          <span className="text-muted fw-normal">
                            Contact No:{' '}
                          </span>
                          <span id="contact-no"> +(314) 234 6789</span>
                        </h6>
                      </div>
                    </div>
                  </Card.Header>
                </Col>
                <Col lg={12}>
                  <Card.Body className="p-2">
                    <Row className="g-2">
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-1 text-uppercase fw-semibold fs-14">
                          Invoice No: #
                          {invoiceData?.order_no !== null
                            ? invoiceData?.order_no
                            : invoiceData?.id}
                        </p>
                        {/* <h5 className="fs-15 mb-0">
                          #<span id="invoice-no">{invoiceData?.id}</span>
                        </h5> */}
                      </Col>
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-1 text-uppercase fw-semibold fs-14">
                          Date:{' '}
                          {moment(invoiceData?.order?.created_at).format(
                            'DD-MM-YYYY',
                          )}{' '}
                          {moment(invoiceData?.order?.created_at).format(
                            'HH:mm A',
                          )}
                        </p>
                        {/* <h5 className="fs-15 mb-0">
                          <span id="invoice-date">
                            {moment(invoiceData?.created_at).format(
                              'DD-MM-YYYY',
                            )}
                          </span>{' '}
                          <small className="text-muted" id="invoice-time">
                            {moment(invoiceData?.created_at).format('HH:mm A')}
                          </small>
                        </h5> */}
                      </Col>
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-1 text-uppercase fw-semibold fs-14">
                          Payment Status:{' '}
                          <span className="fw-medium" id="payment-method">
                            {invoiceData?.order?.payment_type === 22
                              ? 'Online'
                              : 'Cash'}
                          </span>
                        </p>
                        {/* <span
                          className="badge bg-success-subtle text-success"
                          id="payment-status">
                          {invoiceData.payment_type === 21
                            ? 'Paid'
                            : invoiceData.order_transaction_status}
                        </span> */}
                      </Col>
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-1 text-uppercase fw-semibold fs-14">
                          Total Amount: ₹ {invoiceData?.order?.total_amount}
                        </p>
                        {/* <h5 className="fs-15 mb-0">
                          ₹
                          <span id="total-amount">
                            {invoiceData?.final_total_amount}
                          </span>
                        </h5> */}
                      </Col>
                    </Row>
                  </Card.Body>
                </Col>
                <Col lg={12}>
                  <Card.Body className="p-2 border-top border-top-dashed">
                    <Row className="g-3">
                      <Col className="col-6">
                        <h6 className="text-muted text-uppercase fw-semibold fs-14 mb-1">
                          Billing Address
                        </h6>
                        <p className="fw-medium mb-2 fs-16" id="billing-name">
                          {
                            invoiceData?.order?.customer_address
                              ?.customer_first_name
                          }{' '}
                          {
                            invoiceData?.order?.customer_address
                              ?.customer_last_name
                          }
                        </p>
                        <p
                          className="text-muted mb-1"
                          id="billing-address-line-1">
                          {invoiceData?.order?.customer_address?.address_line_1}
                          ,
                        </p>
                        <p
                          className="text-muted mb-1"
                          id="billing-address-line-1">
                          {invoiceData?.order?.customer_address?.address_line_2}
                        </p>
                        <p
                          className="text-muted mb-1"
                          id="billing-address-line-1">
                          {invoiceData?.order?.customer_address?.city_name} -{' '}
                          {invoiceData?.order?.customer_address?.postcode}
                        </p>
                        <p className="text-muted mb-1">
                          <span>Phone: +</span>
                          <span id="billing-phone-no">
                            {invoiceData?.order?.customer_address?.phone_number}
                          </span>
                        </p>
                      </Col>

                      <Col className="col-6">
                        <h6 className="text-muted text-uppercase fw-semibold fs-14 mb-1">
                          SHIPPING ADDRESS
                        </h6>
                        <p className="fw-medium mb-2 fs-16" id="billing-name">
                          {
                            invoiceData?.order?.customer_address
                              ?.customer_first_name
                          }{' '}
                          {
                            invoiceData?.order?.customer_address
                              ?.customer_last_name
                          }
                        </p>
                        <p
                          className="text-muted mb-1"
                          id="billing-address-line-1">
                          {invoiceData?.order?.customer_address?.address_line_1}
                          ,
                        </p>
                        <p
                          className="text-muted mb-1"
                          id="billing-address-line-1">
                          {invoiceData?.order?.customer_address?.address_line_2}
                        </p>
                        <p
                          className="text-muted mb-1"
                          id="billing-address-line-1">
                          {invoiceData?.order?.customer_address?.city_name} -{' '}
                          {invoiceData?.order?.customer_address?.postcode}
                        </p>
                        <p className="text-muted mb-1">
                          <span>Phone: +</span>
                          <span id="billing-phone-no">
                            {invoiceData?.order?.customer_address?.phone_number}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Col>
                <Col lg={12}>
                  <Card.Body className="p-1">
                    <div className="table-responsive">
                      <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                        <thead>
                          <tr className="table-active">
                            <th scope="col" style={{width: '50px'}}>
                              #
                            </th>
                            <th scope="col">Product Details</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Tax (%)</th>
                            <th scope="col">Tax Amount</th>
                            <th scope="col" className="text-end">
                              Total Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody id="products-list">
                          {invoiceData !== null ? (
                            <tr key={invoiceData?.product_id}>
                              <th scope="row">1</th>
                              <td className="text-start">
                                <span className="fw-medium text-wrap">
                                  {invoiceData?.product_name}
                                </span>
                                <p className="text-muted mb-0">
                                  {invoiceData?.option_name}:{' '}
                                  {invoiceData?.option_value_label}
                                </p>
                              </td>
                              <td>₹ {invoiceData?.price}</td>
                              <td>{invoiceData?.qty}</td>
                              <td>{invoiceData?.gst_tax_value}%</td>
                              <td>{invoiceData?.tax_amount ?? 0}</td>
                              <td className="text-end">
                                {invoiceData?.total_amount != null
                                  ? `₹ ${invoiceData?.total_amount}`
                                  : 0}
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <div className="border-top border-top-dashed mt-2">
                      <Table
                        className="table-borderless table-nowrap align-middle mb-0 ms-auto"
                        style={{width: '250px'}}>
                        <tbody>
                          <tr>
                            <td>Sub Total</td>
                            <td className="text-end">
                              ₹{invoiceData?.total_amount}
                            </td>
                          </tr>
                          <tr>
                            <td>Estimated Tax</td>
                            <td className="text-end">
                              {invoiceData?.tax_amount != null
                                ? `₹${invoiceData?.tax_amount}`
                                : 0}
                            </td>
                          </tr>
                          {Boolean(invoiceData?.coupon_name) &&
                          Boolean(invoiceData?.coupon_amount) ? (
                            <tr>
                              <td>
                                Discount{' '}
                                <small className="text-muted">
                                  ({invoiceData?.coupon_name})
                                </small>
                              </td>
                              <td className="text-end">
                                - ₹{invoiceData?.coupon_amount}
                              </td>
                            </tr>
                          ) : (
                            ''
                          )}

                          <tr className="border-top border-top-dashed fs-15">
                            <th scope="row">Total Amount</th>
                            <th className="text-end">
                              ₹{invoiceData?.total_amount}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <div className="mt-4">
                      <div className="alert alert-info notes-section">
                        <p className="mb-0">
                          <span className="fw-semibold">NOTES:</span>
                          <span id="note">
                            {' '}
                            All accounts are to be paid within 7 days from
                            receipt of invoice. To be paid by cheque or credit
                            card or direct payment online. If account is not
                            paid within 7 days the credits details supplied as
                            confirmation of work undertaken will be charged the
                            agreed quoted fee noted above.
                          </span>
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <div className="hstack gap-2 justify-content-end d-print-none mt-3">
          <div className="mb-3 m-auto">
            {' '}
            <Link onClick={printInvoice} to="#" className="btn btn-success">
              <i className="ri-printer-line align-bottom me-1"></i> Print
            </Link>
            {/* <Link
              to="#"
              onClick={() => {
                downloadInvoice(invoiceData.id);
              }}
              className="btn btn-primary ms-2">
              <i className="ri-download-2-line align-bottom me-1"></i> Download
            </Link> */}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default InvoiceDetails;
