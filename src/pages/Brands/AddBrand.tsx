import TooltipWithInfoIcon from 'Common/InfoTool';
import ApiUtils from 'api/ApiUtils';
import {useFormik} from 'formik';
import React from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {toast} from 'react-toastify';
import * as Yup from 'yup';
import {tooltipMessage} from 'utils/Tooltips';

const AddBrand: React.FC<{
  handleClose: () => void;
  editData: any;
  getListPolicy?: any;
}> = ({handleClose, editData, getListPolicy}) => {
  const formik = useFormik({
    initialValues: {
      name: editData?.name ?? '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is Required'),
    }),
    onSubmit: async values => {
      try {
        if (editData !== undefined) {
          (values as any).id = editData.id;
        }
        const response: any =
          editData !== undefined
            ? await ApiUtils.updateBrand(values)
            : await ApiUtils.createBrand(values);
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
              <Form.Label htmlFor="name">Brand Name</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.BrandName} />
            </div>
            <Form.Control
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={
                Boolean(formik.touched.name) && !(formik.errors.name == null)
              }
            />
            {Boolean(formik.touched.name) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.name as string}
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

export default AddBrand;
