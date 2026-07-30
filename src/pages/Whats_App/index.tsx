import React from 'react';
import {Container} from 'react-bootstrap';
import Whatsapp from './Whatsapp';

const WhatsApp = (): JSX.Element => {
  return (
    <div className="page-content">
      <Container fluid>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">WhatsApp Management</h4>
        </div>
        <Whatsapp />
      </Container>
    </div>
  );
};

export default WhatsApp;
