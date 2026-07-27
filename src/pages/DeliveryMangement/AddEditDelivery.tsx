/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {Button, Col, Form, Row} from 'react-bootstrap';
import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {DELIVERY_PERSON_STATUS} from 'Common/constants/layout';
import TooltipWithInfoIcon from 'Common/InfoTool';
import {tooltipMessage} from 'utils/Tooltips';
const AddEditDeliveryModal: React.FC<{
  deliveryData: any;
  handleClose: () => void;
  fetchData: () => void;
}> = ({deliveryData, handleClose, fetchData}) => {
  const formik = useFormik({
    initialValues: {
      first_name: deliveryData?.name?.split(' ')[0] ?? '',
      last_name: deliveryData?.name?.split(' ')[1] ?? '',
      email: deliveryData?.email ?? '',
      phone: deliveryData?.phone ?? '',
      photo: deliveryData?.image ?? '',
      password: deliveryData?.password ?? '',
    },

    validationSchema: Yup.object().shape({
      first_name: Yup.string().required('First Name is required'),
      last_name: Yup.string().required('Last Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .required('Phone is required')
        .test('isTenDigit', 'Phone must be 10 digits', value =>
          /^\d{10}$/.test(value),
        ),
      photo: Yup.mixed().required('Photo is required'),
      password: deliveryData?.id
        ? Yup.string().nullable().label('Password')
        : Yup.string().required('Password is required'),
    }),

    onSubmit: async values => {
      const formData = new FormData();
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      if (!deliveryData?.id) {
        formData.append('password', values.password);
      }
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('status_id', DELIVERY_PERSON_STATUS.ACTIVE.toString());

      // Check if a new image has been selected
      if (values.photo instanceof File) {
        formData.append('image', values.photo);
      }

      if (deliveryData?.id) {
        // If id is present, it's an update
        formData.append('id', deliveryData.id);
        await ApiUtils.updateDeliveryPerson(formData)
          .then((res: any) => {
            toast.success(res?.message);
            fetchData();
            handleClose();
          })
          .catch(err => {
            toast.error(err?.response?.data?.message);
          });
      } else {
        // If id is not present, it's a create
        await ApiUtils.createDeliveryPerson(formData)
          .then((res: any) => {
            toast.success(res?.message);
            fetchData();
            handleClose();
          })
          .catch(err => {
            toast.error(err?.response?.data?.message);
          });
      }
    },
  });

  return (
    <Form
      role="form"
      onSubmit={e => {
        e.preventDefault();
        formik.handleSubmit();
      }}
      encType="multipart/form-data">
      <Col md={12}>
        <div className="mb-3">
          <div className="d-flex">
            Photo
            <TooltipWithInfoIcon text={tooltipMessage.DeliveryImage} />
          </div>
          <Form.Control
            type="file"
            id="photo"
            name="photo"
            onChange={(e: any) => {
              void formik.setFieldValue('photo', e.target.files[0]);
            }}
            isInvalid={
              (formik.touched.photo ?? false) && !(formik.errors.photo == null)
            }
          />
          {formik.errors.photo && formik.touched.photo && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.photo as string}
            </Form.Control.Feedback>
          )}
        </div>
      </Col>
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <div className="d-flex">
              First Name
              <TooltipWithInfoIcon text={tooltipMessage.DeliveryFirstName} />
            </div>
            <Form.Control
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Enter the firstname"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue={formik.values.first_name}
              isInvalid={
                (formik.touched.first_name ?? false) &&
                !(formik.errors.first_name == null)
              }
            />
            {(formik.touched.first_name ?? false) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.first_name as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <div className="d-flex">
              Last Name
              <TooltipWithInfoIcon text={tooltipMessage.DeliveryLastName} />
            </div>
            <Form.Control
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Enter the last name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue={formik.values.last_name}
              isInvalid={
                (formik.touched.last_name ?? false) &&
                !(formik.errors.last_name == null)
              }
            />
            {(formik.touched.last_name ?? false) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.last_name as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>
      </Row>
      <Col md={12}>
        <div className="mb-3">
          <div className="d-flex">
            Email
            <TooltipWithInfoIcon text={tooltipMessage.DeliveryEmail} />
          </div>
          <Form.Control
            type="text"
            id="email"
            name="email"
            placeholder="Enter the email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            defaultValue={formik.values.email}
            isInvalid={
              (formik.touched.email ?? false) && !(formik.errors.email == null)
            }
          />
          {(formik.touched.email ?? false) && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.email as string}
            </Form.Control.Feedback>
          )}
        </div>
      </Col>
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <div className="d-flex">
              Mobile No.
              <TooltipWithInfoIcon text={tooltipMessage.DeliveryMobile} />
            </div>
            <Form.Control
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter the phone number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue={formik.values.phone}
              isInvalid={
                (formik.touched.phone ?? false) &&
                !(formik.errors.phone == null)
              }
            />
            {(formik.touched.phone ?? false) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.phone as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>
        {!deliveryData?.id && (
          <Col md={6}>
            <div className="mb-3">
              <div className="d-flex">
                Password
                <TooltipWithInfoIcon text={tooltipMessage.DeliveryPassword} />
              </div>
              <Form.Control
                type="password"
                id="password"
                name="password"
                placeholder="Enter the password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                defaultValue={formik.values.password}
                isInvalid={
                  (formik.touched.password ?? false) &&
                  !(formik.errors.password == null)
                }
              />
              {(formik.touched.password ?? false) && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.password as string}
                </Form.Control.Feedback>
              )}
            </div>
          </Col>
        )}
      </Row>
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

export default AddEditDeliveryModal;
