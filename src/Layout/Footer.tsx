import React from 'react';
import {Col, Container, Row} from 'react-bootstrap';

const Footer = (): React.JSX.Element => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col sm={6}>{new Date().getFullYear()} © Warehouse.</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
