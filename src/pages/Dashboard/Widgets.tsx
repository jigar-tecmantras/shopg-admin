import ApiUtils from 'api/ApiUtils';
import React, {useEffect, useState} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom'; // Import Link from react-router-dom
import CountUp from 'react-countup';
import {toast} from 'react-toastify';

interface WidgetsProps {
  id: number;
  name: string;
  amount: number;
  decimal?: number;
  icon: string;
  iconColor: string;
  redirectTo: string;
}
interface WidgetsPropsNew {
  startDate?: string;
  endDate?: string;
  resetValue?: number;
}
interface CountOrder {
  cancelOrder: number;
  deliveredOrder: number;
  deliveryPersonAssignOrder: number;
  pendingOrder: number;
}
const Widgets = ({startDate, endDate, resetValue}: WidgetsPropsNew): any => {
  const [cardData, setCardData]: any = useState();

  const fetchDasboardData = async (): Promise<void> => {
    try {
      let resp: any;
      if (resetValue === 0) {
        resp = await ApiUtils.getDasbordData('?date_filter=');
      } else {
        resp = await ApiUtils.getDasbordData(
          `?start_date=${startDate}&end_date=${endDate}`,
        );
      }

      setCardData(resp?.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
  const [orderCount, setOrderCount] = useState<CountOrder>();

  const getOrderCount = async (): Promise<void> => {
    try {
      let response;
      if (resetValue === 0) {
        response = await ApiUtils.getOrderCount();
      } else {
        response = await ApiUtils.getOrderCount(
          `?start_date=${startDate}&end_date=${endDate}`,
        );
      }

      setOrderCount((response as any).data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    void getOrderCount();
  }, []);
  useEffect(() => {
    void getOrderCount();
  }, [resetValue]);
  useEffect(() => {
    void fetchDasboardData();
  }, []);
  useEffect(() => {
    void fetchDasboardData();
  }, [resetValue]);

  const widgetsData: WidgetsProps[] = [
    {
      id: 1,
      name: 'TOTAL ORDERS',
      amount: cardData?.orderCount,
      icon: 'bi bi-bag',
      iconColor: 'secondary',
      redirectTo: '/order-list',
    },
    {
      id: 2,
      name: 'DELIVERED',
      amount: cardData?.delivered,
      icon: 'bi bi-truck',
      iconColor: 'info',
      redirectTo: '/order-list?status=DELIVERED',
    },
    {
      id: 3,
      name: 'TOTAL USERS',
      amount: cardData?.userCount,
      icon: 'ph-user',
      iconColor: 'warning',
      redirectTo: '#',
    },
    {
      id: 4,
      name: 'TOTAL PRODUCTS',
      amount: cardData?.product,
      icon: 'bi bi-box',
      iconColor: 'primary',
      redirectTo: '/products',
    },
    {
      id: 5,
      name: 'PENDING ORDER',
      amount: orderCount?.pendingOrder,
      icon: 'bi bi-hourglass-split',
      iconColor: 'secondary',
      redirectTo: '/order-list?status=PENDING',
    },
    // {
    //   id: 6,
    //   name: 'DELIVERY PERSON ASSIGNED',
    //   amount: orderCount?.deliveryPersonAssignOrder,
    //   icon: 'bi bi-truck',
    //   iconColor: 'info',
    //   redirectTo: '/order-list',
    // },
    {
      id: 7,
      name: 'CANCELLED ORDER',
      amount: orderCount?.cancelOrder,
      icon: 'bi bi-trash',
      iconColor: 'danger',
      redirectTo: '/order-list?status=CANCELED',
    },
  ];

  return (
    <Row>
      {widgetsData?.map((item: any, key: number) => (
        <Col md={6} lg={4} sm={12} key={key}>
          {/* Conditionally render Link based on the widget id */}
          {item.id === 3 ? (
            <Link to={item.redirectTo} style={{textDecoration: 'none'}}>
              <Card className="card-animate">
                <Card.Body>
                  <div className="d-flex justify-content-between gap-1">
                    <div
                      className={
                        'vr rounded bg-' + item.iconColor + ' opacity-50'
                      }
                      style={{width: '4px'}}></div>
                    <div className="flex-grow-1 ms-3">
                      <p
                        data-testid="widget-title"
                        className="text-uppercase fw-medium text-muted fs-14 ">
                        {item.name}
                      </p>
                      <h4 className="fs-22 fw-semibold mb-3">
                        {(item.decimal as boolean) ? '$' : ''}
                        <span
                          className="counter-value"
                          data-target="98851.35"
                          data-testid="widget-amount">
                          <CountUp
                            start={0}
                            end={item.amount}
                            separator=","
                            decimals={(item.decimal as boolean) ? 2 : undefined}
                          />
                        </span>
                      </h4>
                    </div>
                    <div className="avatar-sm flex-shrink-0">
                      <span
                        className={
                          'avatar-title bg-' +
                          item.iconColor +
                          '-subtle text-' +
                          item.iconColor +
                          ' rounded fs-3'
                        }>
                        <i className={item.icon}></i>
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          ) : (
            // Render without Link for other widgets
            <Link to={item.redirectTo} style={{textDecoration: 'none'}}>
              <Card className="card-animate">
                <Card.Body>
                  <div className="d-flex justify-content-between gap-1">
                    <div
                      className={
                        'vr rounded bg-' + item.iconColor + ' opacity-50'
                      }
                      style={{width: '4px'}}></div>
                    <div className="flex-grow-1 ms-3">
                      <p
                        data-testid="widget-title"
                        className="text-uppercase fw-medium text-muted fs-14 ">
                        {item.name}
                      </p>
                      <h4 className="fs-22 fw-semibold mb-3">
                        {(item.decimal as boolean) ? '$' : ''}
                        <span
                          className="counter-value"
                          data-target="98851.35"
                          data-testid="widget-amount">
                          <CountUp
                            start={0}
                            end={item.amount}
                            separator=","
                            decimals={(item.decimal as boolean) ? 2 : undefined}
                          />
                        </span>
                      </h4>
                    </div>
                    <div className="avatar-sm flex-shrink-0">
                      <span
                        className={
                          'avatar-title bg-' +
                          item.iconColor +
                          '-subtle text-' +
                          item.iconColor +
                          ' rounded fs-3'
                        }>
                        <i className={item.icon}></i>
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          )}
        </Col>
      ))}
    </Row>
  );
};

export default Widgets;
