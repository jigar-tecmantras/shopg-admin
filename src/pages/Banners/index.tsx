import React from 'react';
import {Container} from 'react-bootstrap';
import BannersList from './BannersList';

const Brands = (): JSX.Element => {
  return (
    <div className="page-content">
      <Container fluid>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Banners</h4>
        </div>
        <BannersList />
      </Container>
    </div>
  );
};

export default Brands;
