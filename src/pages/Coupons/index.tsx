import React from 'react';
import {Container} from 'react-bootstrap';
import Coupon from './Coupon';

const Coupons = (): JSX.Element => {
  return (
    <div className="page-content">
      <Container fluid>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Coupons</h4>
        </div>
        <Coupon />
      </Container>
    </div>
  );
};

export default Coupons;
