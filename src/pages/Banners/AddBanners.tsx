import TooltipWithInfoIcon from 'Common/InfoTool';
import ApiUtils from 'api/ApiUtils';
import {useFormik} from 'formik';
import React from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {toast} from 'react-toastify';
import * as Yup from 'yup';
import {tooltipMessage} from 'utils/Tooltips';

const AddBanners: React.FC<{
  handleClose: () => void;
  editData: any;
  getListPolicy?: any;
}> = ({handleClose, editData, getListPolicy}) => {
  const formik = useFormik({
    initialValues: {
      URL: editData?.URL ?? '',
      name: editData?.name ?? '',
    },
    validationSchema: Yup.object().shape({
      URL: Yup.string().url('Invalid URL format'),
    }),
    onSubmit: async values => {
      try {
        if (editData !== undefined) {
          (values as any).id = editData.id;
        }
        const response: any =
          editData !== undefined
            ? await ApiUtils.updateBanner(values)
            : await ApiUtils.updateBanner(values);
        toast.success(response.message);
        getListPolicy();
        handleClose();
      } catch (error: any | unknown) {
        if (
          Boolean(error.response) &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data
        ) {
          toast.error(error.response.data.message);
        } else {
          // Something happened in setting up the request that triggered an Error

          toast.error('An unexpected error occurred.');
          handleClose();
        }
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row>
        <Col lg={12}>
          <div className="mb-3">
            {/* <Form.Label htmlFor="name">Brand Name</Form.Label> */}
            <div className="d-flex">
              <Form.Label htmlFor="name">Banner URL</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.BrandName} />
            </div>
            <Form.Control
              type="text"
              id="URL"
              name="URL"
              autoComplete="off"
              placeholder="Enter Banner URL"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.URL ?? ''}
              isInvalid={
                Boolean(formik.touched.URL) && !(formik.errors.URL == null)
              }
            />
            {Boolean(formik.touched.URL) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.URL as string}
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
      </Row>
    </Form>
  );
};

export default AddBanners;
