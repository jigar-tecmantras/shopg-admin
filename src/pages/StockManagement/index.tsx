import React from 'react';
import {Container} from 'react-bootstrap';
import StockManagementList from './StockManagementList';

const StockMangement = (): JSX.Element => {
  return (
    <div className="page-content">
      <Container fluid={true}>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Stock Management </h4>
        </div>
        <StockManagementList />
      </Container>
    </div>
  );
};

export default StockMangement;
