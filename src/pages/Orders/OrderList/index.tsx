import React from 'react';
import {Col, Container, Form, Modal, Row} from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';
import OrderListTable from './OrderListTable';

const OrdersList = (): JSX.Element => {
  document.title = 'Orders | Warehouse ';
  return (
    <div className="page-content">
      <Container fluid={true}>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Order List</h4>
        </div>
        {/* <OrderCard /> */}
        <Row data-testid="order-list-table" id="orderList">
          <Col lg={12}>
            <OrderListTable />
            <div className="noresult" style={{display: 'none'}}>
              <div className="text-center py-4">
                <div className="avatar-md mx-auto mb-4">
                  <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                    <i className="bi bi-search"></i>
                  </div>
                </div>
                <h5 className="mt-2">Sorry! No Result Found</h5>
                <p className="text-muted mb-0">
                  We've searched more than 150+ Orders We did not find any
                  orders for you search.
                </p>
              </div>
            </div>

            <Modal centered>
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Order
                </h5>
              </Modal.Header>
              <Form className="tablelist-form">
                <Modal.Body className="p-4">
                  <div
                    id="alert-error-msg"
                    className="d-none alert alert-danger py-2"></div>
                  <input type="hidden" id="id-field" />
                  <div className="mb-3">
                    <label htmlFor="customername-field" className="form-label">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="customername-field"
                      className="form-control"
                      placeholder="Enter name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="productname-field" className="form-label">
                      Product
                    </label>
                    <div>
                      <select
                        className="form-select"
                        id="productname-field"
                        required>
                        <option value="">Product</option>
                        <option value="World's Most Expensive T-Shirt">
                          World's Most Expensive T-Shirt
                        </option>
                        <option value="Ninja Pro Max Smartwatch">
                          Ninja Pro Max Smartwatch
                        </option>
                        <option value="Carven Lounge Chair Red">
                          Carven Lounge Chair Red
                        </option>
                        <option value="American egale outfitters Shirt">
                          American egale outfitters Shirt
                        </option>
                        <option value="Like Style Women Black Handbag">
                          Like Style Women Black Handbag
                        </option>
                        <option value="Funky Prints T-shirt">
                          Funky Prints T-shirt
                        </option>
                        <option value="Innovative Education Book">
                          Innovative Education Book
                        </option>
                        <option value="Leather band Smartwatches">
                          Leather band Smartwatches
                        </option>
                        <option value="Oxford Button-Down Shirt">
                          Oxford Button-Down Shirt
                        </option>
                        <option value="Apple Headphone">Apple Headphone</option>
                        <option value="Borosil Paper Cup">
                          Borosil Paper Cup
                        </option>
                        <option value="Evolve Smartwatch">
                          Evolve Smartwatch
                        </option>
                      </select>
                    </div>
                  </div>
                  <Row className="gy-4 mb-3">
                    <Col md={6}>
                      <div>
                        <Form.Label htmlFor="createdate-field">
                          Order Date
                        </Form.Label>
                        <Flatpickr
                          className="form-control flatpickr-input"
                          placeholder="Select Date"
                          options={{
                            dateFormat: 'd M, Y',
                          }}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div>
                        <Form.Label htmlFor="deliverydate-field">
                          Delivery Date
                        </Form.Label>
                        <Flatpickr
                          className="form-control flatpickr-input"
                          placeholder="Select Date"
                          options={{
                            dateFormat: 'd M, Y',
                          }}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="gy-4 mb-3">
                    <Col md={6}>
                      <div>
                        <Form.Label htmlFor="amount-field">Amount</Form.Label>
                        <Form.Control
                          type="number"
                          id="amount-field"
                          placeholder="Total amount"
                          required
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div>
                        <Form.Label htmlFor="payment-field">
                          Payment Method
                        </Form.Label>
                        <div>
                          <select
                            className="form-select"
                            required
                            id="payment-field">
                            <option value="">Payment Method</option>
                            <option value="Mastercard">Mastercard</option>
                            <option value="Visa">Visa</option>
                            <option value="COD">COD</option>
                            <option value="Paypal">Paypal</option>
                          </select>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div>
                    <Form.Label htmlFor="delivered-status">
                      Delivery Status
                    </Form.Label>
                    <div>
                      <select
                        className="form-select"
                        required
                        id="delivered-status">
                        <option value="">Delivery Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Inprogress">Inprogress</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Pickups">Pickups</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Returns">Returns</option>
                      </select>
                    </div>
                  </div>
                </Modal.Body>
              </Form>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrdersList;
