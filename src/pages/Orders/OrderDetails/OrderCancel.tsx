import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Button, Form} from 'react-bootstrap';

const OrderCancel: React.FC<{handleClose: () => void}> = ({handleClose}) => {
  const validationSchema = Yup.object({
    reason: Yup.string().required('Reason is required'),
  });

  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    validationSchema,
    onSubmit: async values => {
      // Handle form submission logic here
      // console.log('Submitted:', values);
    },
  });

  return (
    <div>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group controlId="reason">
          <Form.Label htmlFor="reason">Reason for Cancellation</Form.Label>
          <Form.Control
            type="text"
            name="reason"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.reason}
            isInvalid={
              (formik.touched.reason ?? false) &&
              !(formik.errors.reason == null)
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.reason}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="modal-footer">
          <div className="hstack gap-2 justify-content-end">
            <Button
              className="btn-ghost-danger"
              onClick={() => {
                handleClose();
              }}>
              Close
            </Button>
            <Button
              disabled={!formik.dirty || formik.isSubmitting}
              variant="success"
              id="add-btn">
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default OrderCancel;
