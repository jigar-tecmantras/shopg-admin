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
      image: null,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is Required'),
      image: Yup.mixed()
    .nullable()
    .test(
      'required',
      'Brand Image is required',
      function (value: any) {
        if (editData?.image) return true;
        return value instanceof File;
      }
    )
    .test('fileSize', 'Image must be less than 2 MB', (value: any) => {
      if (!value) return true;
      return value.size <= 2 * 1024 * 1024;
    })
    .test(
      'fileFormat',
      'Only JPG, JPEG and PNG files are allowed',
      (value: any) => {
        if (!value) return true;

        return [
          'image/jpeg',
          'image/jpg',
          'image/png',
        ].includes(value.type);
      }
    ),
    }),
    onSubmit: async values => {
      try {
        const formData = new FormData();

        formData.append('name', values.name);

        if (values.image) {
          formData.append('image', values.image);
        }

        if (editData !== undefined) {
          formData.append('id', editData.id);
        }

        const response =
          editData !== undefined
            ? await ApiUtils.updateBrand(formData)
            : await ApiUtils.createBrand(formData);

        toast.success((response as any).message);
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

  const showNameError = Boolean(formik.submitCount > 0 && formik.errors.name);
  const showImageError = Boolean(
    (formik.submitCount > 0 || (formik.touched.image && Boolean(formik.values.image))) &&
      formik.errors.image,
  );
  const shouldShowPreview = Boolean(
    (formik.values.image || editData?.image) && !showImageError && !formik.errors.image,
  );

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
              isInvalid={showNameError}
            />
            {showNameError && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.name as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="image">Brand Image</Form.Label>

              <TooltipWithInfoIcon
                text="Upload a JPG or PNG image (Max 2 MB)"
              />
            </div>

            <Form.Control
              type="file"
              id="image"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.currentTarget.files?.[0] || null;

                formik.setFieldValue('image', file, true);
                formik.setFieldTouched('image', true, false);
                void formik.validateField('image');
              }}
              isInvalid={showImageError}
            />

            {showImageError && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.image as string}
              </Form.Control.Feedback>
            )}

            {shouldShowPreview && (
              <div className="mt-3">
                <img
                  src={
                    formik.values.image
                      ? URL.createObjectURL(formik.values.image as File)
                      : editData.image
                  }
                  alt="Brand Preview"
                  className="img-thumbnail"
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </div>
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
