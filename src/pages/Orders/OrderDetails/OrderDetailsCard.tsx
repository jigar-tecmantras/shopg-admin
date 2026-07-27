import React from 'react';
import {Col, Row} from 'react-bootstrap';

interface OrderDetail {
  // customer_first_name: string;
  // customer_last_name: string;
  // phone_number: string;
  // address_line_1: string;
  // address_line_2: string;
  // city_name: string;
  // postcode: string;
  customer_address: {
    customer_first_name: string;
    customer_last_name: string;
    address_line_1: string;
    address_line_2: string;
    city_name: string;
    state_name: string;
    postcode: number;
    landmark: string;
    phone_number: number;
  };
  customer_address_id: string;
  same_as_customer_address: number;
  shipping_address: {
    address_line_1: string;
    address_line_2: string;
    city_name: string;
    state_name: string;
    postcode: number;
    landmark: string;
    phone_number: number;
  };
  shipping_address_id: string;
}

interface OrderDetailsCardProps {
  orderDetail?: OrderDetail;
}
const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({
  orderDetail,
}): JSX.Element => {
  return (
    <div>
      <Row>
        <Col xxl={6} lg={6}>
          <div className="card bg-success bg-opacity-10 card-height-order border-0">
            <div className="card-body">
              <div className="d-flex gap-3">
                <div className="flex-grow-1">
                  <h6 className="fs-18 mb-3">Customer Info</h6>
                  <p className="mb-0 fw-medium">
                    {orderDetail?.customer_address != null ? (
                      orderDetail?.customer_address?.customer_first_name !==
                      '' ? (
                        orderDetail?.customer_address?.customer_first_name +
                        ' ' +
                        orderDetail?.customer_address?.customer_last_name
                      ) : (
                        ''
                      )
                    ) : (
                      <>
                        <p className="text-center">Data Not Found</p>
                      </>
                    )}
                  </p>
                  <p className="mb-0">
                    {orderDetail?.customer_address?.phone_number}
                  </p>

                  {/* {orderDetail?.customer_address != null ? (
                    <>
                      <h6 className="fs-18 mt-3">Billing Address</h6>
                      <p className="mb-0">
                        {orderDetail?.customer_address?.address_line_1},
                        asdasdasd
                        {orderDetail?.customer_address?.address_line_2}
                        sdsasdasdasdasdasdadadadasd asdasdasdasdasd sdfsdfsdfsf
                        sdsdfsf
                      </p>
                      <p className="mb-1">
                        {orderDetail?.customer_address?.city_name}
                        ,xzxzxczcxzxzxczxc sadadadad
                        {orderDetail?.customer_address?.postcode}zxczxc sdasdasd
                      </p>
                      <p className="mb-0">
                        {orderDetail?.customer_address?.phone_number}
                        fghfhfghfhfhsdf sdsfsdf
                      </p>
                    </>
                  ) : null} */}
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <div className="avatar-title bg-success-subtle text-success rounded fs-3">
                    <i className="ph-user-circle"></i>
                  </div>
                </div>
              </div>
              <div>
                {orderDetail?.customer_address != null ? (
                  <>
                    <h6 className="fs-18 mt-3">Billing Address</h6>
                    <p className="mb-0">
                      {orderDetail?.customer_address?.address_line_1},
                      {orderDetail?.customer_address?.address_line_2}
                    </p>
                    <p className="mb-1">
                      {orderDetail?.customer_address?.city_name}
                      {orderDetail?.customer_address?.postcode}
                    </p>
                    <p className="mb-0">
                      {orderDetail?.customer_address?.phone_number}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={6} lg={6}>
          <div className="card bg-primary card-height-order bg-opacity-10 border-0">
            <div className="card-body">
              <div className="d-flex gap-3">
                <div className="flex-grow-1">
                  <h6 className="fs-18 mb-3">Shipping Address</h6>
                  {orderDetail?.same_as_customer_address !== 1 &&
                  orderDetail?.shipping_address !== null ? (
                    <>
                      <p className="mb-0">
                        {orderDetail?.shipping_address?.address_line_1},{' '}
                        {orderDetail?.shipping_address?.address_line_2}
                      </p>
                      <p className="mb-1">
                        {orderDetail?.shipping_address?.city_name},{' '}
                        {orderDetail?.shipping_address?.postcode}
                      </p>
                      <p className="mb-0">
                        {orderDetail?.shipping_address?.phone_number}
                      </p>
                    </>
                  ) : (
                    <>
                      {orderDetail?.customer_address !== null ? (
                        <>
                          <p className="mb-0">
                            {orderDetail?.customer_address?.address_line_1},
                            {orderDetail?.customer_address?.address_line_2}
                          </p>
                          <p className="mb-1">
                            {orderDetail?.customer_address?.city_name},
                            {orderDetail?.customer_address?.postcode}
                          </p>
                          <p className="mb-0">
                            {orderDetail?.customer_address?.phone_number}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-center">Data Not Found</p>
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <div className="avatar-title bg-primary-subtle text-primary rounded fs-3">
                    <i className="ph-map-pin"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailsCard;
