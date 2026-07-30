import ApiUtils from 'api/ApiUtils';
import {useFormik} from 'formik';
import React, {useRef} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {toast} from 'react-toastify';
import * as Yup from 'yup';

interface WhatsAppFormValues {
  title: string;
  number: string;
  message: string;
  status: number;
}

const AddData: React.FC<{
  handleClose: () => void;
  editData: any;
  getListPolicy?: any;
}> = ({handleClose, editData, getListPolicy}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .max(100, 'Title must be 100 characters or less'),
    number: Yup.string()
      .required('Phone number is required')
      .matches(/^08\d{8}$/, 'Please enter a valid Iris number'),
    message: Yup.string()
      .required('Message is required')
      .max(1000, 'Message must be 1000 characters or less'),
    status: Yup.number()
      .required('Status is required')
      .oneOf([1, 2], 'Status must be Active or Inactive'),
  });

  const formik = useFormik<WhatsAppFormValues>({
    initialValues: {
      title: editData?.title ?? '',
      number: editData?.number ?? '',
      message: editData?.message ?? '',
      status: editData?.status ?? 1,
    },
    validationSchema,
    onSubmit: async values => {
      try {
        const payload = {
          title: values.title,
          number: values.number,
          message: values.message,
          status: values.status,
          ...(editData?.id && {id: editData.id}),
        };

        const response: any =
          editData !== undefined
            ? await ApiUtils.updateWhatsapp(payload)
            : await ApiUtils.createWhatsapp(payload);

        toast.success(response.message);
        getListPolicy();
        handleClose();
      } catch (error: any) {
        if (
          error.response &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
    },
  });

  return (
    <Form
      ref={formRef}
      onSubmit={e => {
        e.preventDefault();
        void formik.handleSubmit(e);
      }}>
      <Row>
        <Col lg={12}>
          <div className="mb-3">
            <Form.Label htmlFor="title">Title</Form.Label>
            <Form.Control
              type="text"
              id="title"
              name="title"
              placeholder="Enter WhatsApp account title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              maxLength={100}
              isInvalid={
                Boolean(formik.touched.title) && !(formik.errors.title == null)
              }
            />
            {Boolean(formik.touched.title) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.title as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <Form.Label htmlFor="number">Phone Number</Form.Label>
            <div className="input-group">
              <span className="input-group-text">+353</span>
              <Form.Control
                type="text"
                id="number"
                name="number"
                placeholder="Enter phone number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.number}
                isInvalid={
                  Boolean(formik.touched.number) &&
                  !(formik.errors.number == null)
                }
              />
              {Boolean(formik.touched.number) && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.number as string}
                </Form.Control.Feedback>
              )}
            </div>
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <Form.Label htmlFor="message">Message</Form.Label>
            <Form.Control
              as="textarea"
              id="message"
              name="message"
              placeholder="Enter message"
              rows={4}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
              maxLength={1000}
              isInvalid={
                Boolean(formik.touched.message) &&
                !(formik.errors.message == null)
              }
            />
            <small className="text-muted">
              {formik.values.message.length}/1000
            </small>
            {Boolean(formik.touched.message) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.message as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>
          <Col lg={12}>
            <div className="mb-3">
              <Form.Label htmlFor="status">Status</Form.Label>
              <Form.Select
                id="statusOption"
                style={{width:'30%'}}
                name="status"
                onChange={e => formik.setFieldValue('status', Number(e.target.value))}
                onBlur={formik.handleBlur}
                value={formik.values.status}
                isInvalid={
                  Boolean(formik.touched.status) &&
                  !(formik.errors.status == null)
                }>
                <option value={1}>Active</option>
                <option value={2}>Inactive</option>
              </Form.Select>
              {Boolean(formik.touched.status) && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.status as string}
                </Form.Control.Feedback>
              )}
            </div>
          </Col>

        <Col lg={12} className="modal-footer mt-3">
          <div className="hstack gap-2 justify-content-end">
            
            <Button variant="primary" id="add-btn" type="submit">
              {editData ? 'Update' : 'Submit'}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default AddData;
