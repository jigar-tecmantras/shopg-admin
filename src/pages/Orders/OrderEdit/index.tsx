import React from 'react';
import {Form, Col, Row, Button, InputGroup} from 'react-bootstrap';
import {useFormik} from 'formik';
import * as Yup from 'yup';

const OrderEdit: React.FC<{handleClose: () => void}> = ({handleClose}) => {
  const validationSchema = Yup.object({
    customer_name: Yup.string().required('Customer Name is required'),
    product: Yup.string().required('Product is required'),
    order_date: Yup.date().required('Order Date is required'),
    deliverydate: Yup.date().required('Delivery Date is required'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive'),
    payment: Yup.string().required('Payment Method is required'),
    delivered_Status: Yup.string().required('Delivery Status is required'),
  });

  const formik = useFormik({
    initialValues: {
      customer_name: '',
      product: '',
      order_date: '',
      delivery_date: '',
      amount: 0,
      payment: '',
      delivered_Status: '',
    },
    validationSchema,
    onSubmit: async values => {
      // Handle form submission logic here
    },
  });

  return (
    <Form
      className="tablelist-form"
      onSubmit={e => {
        e.preventDefault();
        formik.handleSubmit();
      }}>
      <Row>
        <Col lg={6}>
          <div className="mb-3">
            <Form.Label htmlFor="customer_name">Customer Name</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                id="customer_name"
                name="customer_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.customer_name}
                isInvalid={
                  (formik.touched.customer_name ?? false) &&
                  !(formik.errors.customer_name == null)
                }
              />
              {(formik.touched.customer_name ?? false) && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.customer_name}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </div>
        </Col>
        <Col lg={6}>
          <div className="mb-3">
            <Form.Label htmlFor="status_id">Product</Form.Label>
            <Form.Select
              as="select"
              id="product"
              name="product"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.product}
              isInvalid={
                Boolean(formik.touched.product ?? false) &&
                !(formik.errors.product == null)
              }>
              <option disabled value="">
                --Select Product--
              </option>
              <option disabled value="">
                --Product--
              </option>
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
              <option value="Funky Prints T-shirt">Funky Prints T-shirt</option>
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
              <option value="Borosil Paper Cup">Borosil Paper Cup</option>
              <option value="Evolve Smartwatch">Evolve Smartwatch</option>
            </Form.Select>
            {(formik.touched.product ?? false) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.product}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>
      </Row>

      <Row className="gy-4 mb-3">
        <Col md={6}>
          <div>
            <Form.Label htmlFor="order_date">Order Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Select Date"
              name="order_date"
              id="order_date"
              value={formik.values.order_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                (formik.touched.order_date ?? false) &&
                !(formik.errors.order_date == null)
              }
            />
            {(formik.touched.order_date ?? false) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.order_date}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div>
            <Form.Label htmlFor="delivery_date">Delivery Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Select Date"
              name="delivery_date"
              id="delivery_date"
              value={formik.values.delivery_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={formik.values.order_date}
              isInvalid={
                (formik.touched.order_date ?? false) &&
                !(formik.errors.order_date == null)
              }
            />
            {(formik.touched.delivery_date ?? false) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.delivery_date}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>
      </Row>

      <Row className="gy-4 mb-3">
        <Col md={6}>
          <div>
            <Form.Label htmlFor="amount">Amount</Form.Label>
            <Form.Control
              type="number"
              id="amount"
              placeholder="Total amount"
              required
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                (formik.touched.amount ?? false) &&
                !(formik.errors.amount == null)
              }
            />
            {(formik.touched.amount ?? false) &&
              formik.errors.amount != null && (
                <div className="invalid-feedback">{formik.errors.amount}</div>
              )}
          </div>
        </Col>
        <Col md={6}>
          <div>
            <Form.Label htmlFor="payment-field">Payment Method</Form.Label>
            <div>
              <select
                className={`form-select ${
                  (formik.touched.payment ?? false) &&
                  formik.errors.payment != null
                    ? 'is-invalid'
                    : ''
                }`}
                required
                id="payment"
                name="payment"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.payment}>
                <option disabled value="">
                  --Payment Method--
                </option>
                <option value="Mastercard">Mastercard</option>
                <option value="Visa">Visa</option>
                <option value="COD">COD</option>
                <option value="Paypal">Paypal</option>
              </select>
              {(formik.touched.payment ?? false) &&
                formik.errors.payment != null && (
                  <div className="invalid-feedback">
                    {formik.errors.payment}
                  </div>
                )}
            </div>
          </div>
        </Col>
      </Row>

      <div>
        <Form.Label htmlFor="delivered-status">Delivery Status</Form.Label>
        <div>
          <select
            className={`form-select ${
              (formik.touched.delivered_Status ?? false) &&
              formik.errors.delivered_Status != null
                ? 'is-invalid'
                : ''
            }`}
            required
            id="delivered-status"
            name="delivered_Status"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.delivered_Status}>
            <option disabled value="">
              --Delivery Status--
            </option>
            <option value="Pending">Pending</option>
            <option value="Inprogress">Inprogress</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pickups">Pickups</option>
            <option value="Delivered">Delivered</option>
            <option value="Returns">Returns</option>
          </select>
          {(formik.touched.delivered_Status ?? false) && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.delivered_Status}
            </Form.Control.Feedback>
          )}
        </div>
      </div>

      <div className="modal-footer">
        <div className="hstack gap-2 justify-content-end">
          <Button
            className="btn-ghost-danger"
            onClick={() => {
              handleClose();
            }}>
            Close
          </Button>
          <Button variant="success" id="add-btn">
            Submit
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default OrderEdit;
