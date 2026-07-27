/* eslint-disable @typescript-eslint/naming-convention */
import ModalContainer from 'Common/ModalContainer';
import React, {useEffect, useState} from 'react';
import {Form, Button, Col} from 'react-bootstrap';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
import ApiUtils from 'api/ApiUtils';
import {useDispatch} from 'react-redux';
import {
  setOrderStatusData,
  setOrderStatusforCard,
} from 'slices/orderStatus/reducer';
interface Props {
  toogleStatus: any;
  showModal: any;
  setIsStatusUpdated: any;

  details?: {
    id: number;
    ticket_no: number;
    comment: string;
    issue_type: string;
    status_id: number;
    order_status: number;
  };
}

const OrderStatusModal = ({
  toogleStatus,
  showModal,
  details,
  setIsStatusUpdated,
}: Props): JSX.Element => {
  const modalData = (): JSX.Element => {
    const [orderStatus, setOrderStatus] = useState([]);
    const dispatch = useDispatch();

    const formikValidation = useFormik({
      initialValues: {
        status: details?.order_status !== null ? details?.order_status : null,
      },
      validationSchema: Yup.object().shape({
        status: Yup.number().required('Please Select Status'),
      }),
      onSubmit: async values => {
        const body = {
          order_id: details?.id,
          order_status: values.status,
        };
        try {
          const response: any = await ApiUtils.updateOrderStatus(body);
          toast.success(response.message);
          formikValidation.resetForm();
          setIsStatusUpdated(true);
          dispatch(setOrderStatusforCard(true));
          toogleStatus();
        } catch (error: any | unknown) {
          toast.error('Something went wrong');
        }
      },
    });

    const fetchStatus = async (): Promise<void> => {
      try {
        const response: any = await ApiUtils.getStatus(`type=order_status`);
        setOrderStatus(response.data);
        dispatch(setOrderStatusData(response.data));
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    useEffect(() => {
      void fetchStatus();
      void formikValidation.setFieldValue('status', details?.order_status);
    }, [details]);

    return (
      <Col lg={12}>
        <Form
          onSubmit={e => {
            e.preventDefault();
            formikValidation.handleSubmit();
          }}>
          <div className="mb-3">
            <Form.Label htmlFor="status_id">Order Status</Form.Label>
            <Form.Select
              className="form-select"
              name="status"
              id="status_id"
              onBlur={formikValidation.handleBlur}
              value={formikValidation.values.status ?? ''}
              onChange={async e =>
                await formikValidation.setFieldValue(
                  'status',
                  Number(e.target.value),
                )
              }>
              <option selected>Select Status</option>
              {orderStatus?.map((data: any, i) => {
                return (
                  <option key={i} value={data.id}>
                    {data.name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
          <div className="hstack gap-2 justify-content-end">
            <Button type="submit" variant="primary" id="add-btn">
              Update Status
            </Button>
          </div>
        </Form>
      </Col>
    );
  };

  return (
    <ModalContainer
      showModal={showModal}
      handleClose={toogleStatus}
      modalTitle="Status"
      modalBody={modalData()}
    />
  );
};

export default OrderStatusModal;
