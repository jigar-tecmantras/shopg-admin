/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';

// Formik validation
import * as Yup from 'yup';
import {useFormik} from 'formik';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import TooltipWithInfoIcon from 'Common/InfoTool';
import {tooltipMessage} from 'utils/Tooltips';
interface AddHsnProps {
  modalAddCouponsModals: any;
  togAddCouponsModals: any;
  edit?: any;
  setEditHsn?: any;
  setAddHsn?: any;
}

const AddHSnModal = ({
  modalAddCouponsModals,
  togAddCouponsModals,
  edit,
  setEditHsn,
  setAddHsn,
}: AddHsnProps): JSX.Element => {
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      hsnTitle: edit.name !== '' ? edit.name : '',
      hsnCode: edit.hsn_code !== '' ? edit.hsn_code : '',
      hsnpercentage: edit.value !== '' ? edit.value : '',
    },
    validationSchema: Yup.object({
      hsnTitle: Yup.string().required('GST Tax title is required'),
      hsnCode: Yup.number().required('GST Tax code  is required'),
      hsnpercentage: Yup.number().required('Please Enter GST Tax percentage'),
    }),
    onSubmit: (values: any): void => {
      const body = {
        name: values?.hsnTitle,
        hsn_code: values.hsnCode,
        value: `${values.hsnpercentage}`,
        ...(edit.id ? {id: edit?.id, old_name: edit?.name} : {}),
      };
      if (edit.id) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        ApiUtils.updateHsn(body)
          .then((data: any) => {
            toast.success(data?.message);
            setEditHsn(true);
            togAddCouponsModals();
          })
          .catch((error: any) => {
            toast.error(error?.response?.data?.message);
          });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        ApiUtils.createHsn(body)
          .then((data: any) => {
            toast.success(data?.message);
            setAddHsn(true);
            validation.resetForm();
            togAddCouponsModals();
          })
          .catch((error: any) => {
            toast.error(error?.response?.data?.message);
          });
      }
    },
  });
  const closeModal: any = () => {
    validation.resetForm();
  };
  return (
    <Modal
      id="showModal"
      className="fade zoomIn"
      size="lg"
      show={modalAddCouponsModals}
      onHide={() => {
        togAddCouponsModals();
        closeModal();
      }}
      centered>
      <Modal.Header className="px-4 pt-4" closeButton>
        <h5 className="modal-title fs-18" id="exampleModalLabel">
          {edit?.id ? 'Edit GST Tax' : 'Add GST Tax'}
        </h5>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form
          data-testid="hsn-modal-form"
          onSubmit={e => {
            e.preventDefault();
            validation.handleSubmit();
          }}
          className="tablelist-form">
          <Row>
            <div
              id="alert-error-msg"
              className="d-none alert alert-danger py-2"></div>
            <input type="hidden" id="id-field" />
            <Col lg={12}>
              <div className="mb-3">
                <div className="d-flex">
                  Title <TooltipWithInfoIcon text={tooltipMessage.GstTitle} />
                </div>
                <Form.Control
                  type="text"
                  id="couponTitle-field"
                  placeholder="GST Tax title"
                  name="hsnTitle"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  defaultValue={
                    validation.values.hsnTitle || edit ? edit.name : ''
                  }
                  isInvalid={
                    !!(
                      Boolean(validation.touched.hsnTitle) &&
                      Boolean(validation.errors.hsnTitle)
                    )
                  }
                />
                {Boolean(validation.touched.hsnTitle) &&
                Boolean(validation.errors.hsnTitle) ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="required-mark">
                    {validation.errors.hsnTitle}
                  </Form.Control.Feedback>
                ) : null}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  Code <TooltipWithInfoIcon text={tooltipMessage.GstCode} />
                </div>
                <Form.Control
                  type="number"
                  id="code-field"
                  name="hsnCode"
                  placeholder="Enter GST Tax code"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  defaultValue={
                    validation.values.hsnCode || edit ? edit.hsn_code : ''
                  }
                  isInvalid={
                    !!(
                      Boolean(validation.touched.hsnCode) &&
                      Boolean(validation.errors.hsnCode)
                    )
                  }
                  onKeyDown={e => {
                    // Prevent 'e', 'E', '-', '+' and any non-numeric keys except Backspace and Delete
                    if (
                      ['e', 'E', '+', '-'].includes(e.key) ||
                      (!/[0-9]/.test(e.key) &&
                        e.key !== 'Backspace' &&
                        e.key !== 'Delete')
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                {Boolean(validation.touched.hsnCode) &&
                Boolean(validation.errors.hsnCode) ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="required-mark">
                    {validation.errors.hsnCode}
                  </Form.Control.Feedback>
                ) : null}
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  Percentage
                  <TooltipWithInfoIcon text={tooltipMessage.GstPercentage} />
                </div>
                <div className="input-group has-validation mb-3">
                  <span
                    className="input-group-text fs-6"
                    id="product-price-addon">
                    %
                  </span>
                  <Form.Control
                    type="number"
                    id="discount-field"
                    name="hsnpercentage"
                    placeholder="Enter percentage"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    defaultValue={
                      validation.values.hsnpercentage || edit ? edit.value : ''
                    }
                    isInvalid={
                      !!(
                        Boolean(validation.touched.hsnpercentage) &&
                        Boolean(validation.errors.hsnpercentage)
                      )
                    }
                    onKeyDown={e => {
                      // Prevent 'e', 'E', '-', '+' and any non-numeric keys except Backspace and Delete
                      if (
                        ['e', 'E', '+', '-'].includes(e.key) ||
                        (!/[0-9]/.test(e.key) &&
                          e.key !== 'Backspace' &&
                          e.key !== 'Delete')
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                {Boolean(validation.touched.hsnpercentage) &&
                Boolean(validation.errors.hsnpercentage) ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="required-mark">
                    {validation.errors.hsnpercentage}
                  </Form.Control.Feedback>
                ) : null}
              </div>
            </Col>

            <Col lg={12} className="modal-footer">
              <div className="hstack gap-2 justify-content-end">
                <Button type="submit" variant="primary" id="add-btn">
                  {edit.id ? 'Edit GST Tax' : 'Add GST Tax'}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddHSnModal;
