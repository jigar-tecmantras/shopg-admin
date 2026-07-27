import CancelledOrderSvg from 'Common/SVG/CancelledOrderSvg';
import DeliveryOrderSvg from 'Common/SVG/DeliveryOrderSvg';
import PendingOrderSvg from 'Common/SVG/PendingOrderSvg';
import PickUpOrderSvg from 'Common/SVG/PickUpOrderSvg';
import ApiUtils from 'api/ApiUtils';
import React, {useEffect, useState} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
// import CountUp from 'react-countup/build/CountUp';
import CountUp from 'react-countup';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {setOrderStatusforCard} from 'slices/orderStatus/reducer';
interface CountOrder {
  cancelOrder: number;
  deliveredOrder: number;
  deliveryPersonAssignOrder: number;
  pendingOrder: number;
}
const OrderCard = (): JSX.Element => {
  const [orderCount, setOrderCount] = useState<CountOrder>();

  const {OrderStatus}: any = useSelector((state: any) => state);
  const dispatch = useDispatch();
  const getOrderCount = async (): Promise<void> => {
    try {
      const response = await ApiUtils.getOrderCount();
      setOrderCount((response as any).data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    void getOrderCount();
    dispatch(setOrderStatusforCard(false));
  }, [OrderStatus.status]);
  return (
    <Row
      data-testid="order-card"
      className="row-cols-xxl-4 row-cols-lg-3 row-cols-md-2 row-cols-1">
      <Col>
        <Card className="shadow-sm border-0 overflow-hidden card-animate">
          <div className="position-absolute end-0 start-0 top-0 z-0">
            <PendingOrderSvg />
          </div>
          <Card.Body className="p-4 z-1 position-relative">
            <div className="d-flex align-items-center gap-3">
              <div className="flex-shrink-0 avatar-sm">
                <div className="avatar-title bg-warning-subtle text-warning fs-3 rounded">
                  <i className="ph-clock-clockwise"></i>
                </div>
              </div>
              <div>
                <h4 className="fs-22 fw-semibold mb-1">
                  <CountUp
                    start={0}
                    end={orderCount?.pendingOrder ?? 0}
                    duration={3}
                  />
                </h4>
                <p className="mb-0 fw-medium text-uppercase fs-14">
                  Pending Orders
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xxl={3} lg={6}>
        <Card className="shadow-sm border-0 overflow-hidden card-animate">
          <div className="position-absolute end-0 start-0 bottom-0 z-0">
            <DeliveryOrderSvg />
          </div>
          <Card.Body className="p-4 z-1 position-relative">
            <div className="d-flex align-items-center gap-3">
              <div className="flex-shrink-0 avatar-sm">
                <div className="avatar-title bg-success-subtle text-success fs-3 rounded">
                  <i className="ph-truck"></i>
                </div>
              </div>
              <div>
                <h4 className="fs-22 fw-semibold mb-1">
                  <CountUp
                    start={0}
                    end={orderCount?.deliveredOrder ?? 0}
                    duration={3}
                  />
                </h4>
                <p className="mb-0 fw-medium text-uppercase fs-14">
                  Delivered Orders
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xxl={3} lg={6}>
        <Card className="shadow-sm border-0 overflow-hidden card-animate">
          <div className="position-absolute end-0 start-0 top-0 z-0">
            <PickUpOrderSvg />
          </div>
          <Card.Body className="p-4 z-1 position-relative">
            <div className="d-flex align-items-center gap-3">
              <div className="flex-shrink-0 avatar-sm">
                <div className="avatar-title bg-secondary-subtle text-secondary fs-3 rounded">
                  <i className="ph-cube"></i>
                </div>
              </div>
              <div>
                <h4 className="fs-22 fw-semibold mb-1">
                  <CountUp
                    start={0}
                    end={orderCount?.deliveryPersonAssignOrder ?? 0}
                    duration={3}
                  />
                </h4>
                <p className="mb-0 fw-medium text-uppercase fs-14">
                  Delivery Person Assigned
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xxl={3} lg={6}>
        <Card className="shadow-sm border-0 overflow-hidden card-animate">
          <div className="position-absolute end-0 start-0 bottom-0 z-0">
            <CancelledOrderSvg />
          </div>
          <Card.Body className="p-4 z-1 position-relative">
            <div className="d-flex align-items-center gap-3">
              <div className="flex-shrink-0 avatar-sm">
                <div className="avatar-title bg-danger-subtle text-danger fs-3 rounded">
                  <i className="ph-trash"></i>
                </div>
              </div>
              <div>
                <h4 className="fs-22 fw-semibold mb-1">
                  <CountUp start={0} end={orderCount?.cancelOrder ?? 0} />
                </h4>
                <p className="mb-0 fw-medium text-uppercase fs-14">
                  Cancelled Orders
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderCard;
