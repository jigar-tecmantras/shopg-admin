import React from 'react';
import {Container} from 'react-bootstrap';
import PolicyList from './PolicyList';

const Policy = (): JSX.Element => {
  document.title = 'Policy Management | Admin';
  return (
    <div className="page-content">
      <Container fluid>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Policy Management</h4>
        </div>
        <PolicyList />
      </Container>
    </div>
  );
};

export default Policy;
