/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {Button, Col, Form} from 'react-bootstrap';
import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';

const UserEditModal: React.FC<{
  userData: any;
  handleClose: () => void;
  getUserList: () => Promise<void>;
}> = ({userData, handleClose, getUserList}) => {
  const formik = useFormik({
    initialValues: {
      email: userData?.user_email,
      phone: userData?.phone,
    },

    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^08[3-9]{8}$/, "Enter a valid Irish mobile number") 
        .required("Phone number is required"),
    }),
    onSubmit: values => {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('id', userData?.id);
      void ApiUtils.updateCustomerDetails(formData)
        .then((res: any) => {
          toast.success(res?.message);
          handleClose();
          void getUserList();
        })
        .catch((err: any) => {
          toast.error(err?.response?.data?.message);
        });
    },
  });

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        formik.handleSubmit();
      }}>
      <Col md={12}>
        <div className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            defaultValue={formik.values.email}
            isInvalid={
              (formik.touched.email ?? false) && !(formik.errors.email == null)
            }
          />
          {formik.touched.email && typeof formik.errors.email === 'string' && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          )}
        </div>
      </Col>
      <Col md={12}>
        <div className="mb-3">
          <Form.Label htmlFor="pnone">Mobile No.</Form.Label>
          <Form.Control
            type="text"
            id="phone"
            name="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            defaultValue={formik.values.phone}
            isInvalid={
              (formik.touched.phone ?? false) && !(formik.errors.phone == null)
            }
          />
          {formik.touched.phone && typeof formik.errors.phone === 'string' && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.phone}
            </Form.Control.Feedback>
          )}
        </div>
      </Col>
      <Col lg={12} className="modal-footer">
        <div className="hstack gap-2 justify-content-end">
          <Button variant="primary" id="add-btn" type="submit">
            Submit
          </Button>
        </div>
      </Col>
    </Form>
  );
};

export default UserEditModal;
