import React from 'react';
import {Container} from 'react-bootstrap';

import PaymentTrackingListTable from './paymentTrackingListTable';

const PaymentTrackingList = (): JSX.Element => {
  return (
    <div className="page-content">
      <Container fluid={true}>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Payment Tracking List</h4>
        </div>

        <PaymentTrackingListTable />
      </Container>
    </div>
  );
};

export default PaymentTrackingList;
