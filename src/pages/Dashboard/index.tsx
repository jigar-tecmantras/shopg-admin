import React from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import Widgets from './Widgets';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import Revenue from './Revenue';
import RecentOrders from './RecentOrders';

const Dashboard = (): React.JSX.Element => {
  document.title = DOCUMENT_TITLE.DASHBOARD_TITLE;

  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [Reset, setReset] = React.useState<number>(0);
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  return (
    <div className="page-content">
      <Container fluid>
        <Row className="mb-3">
          <Col lg={6} className=" d-flex align-items-center">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Dashboard</h4>
            </div>
          </Col>
          <Col
            lg={6}
            className="row d-flex justify-content-end"
            style={{paddingTop: '9px', paddingBottom: '6px'}}>
            <div
              className=" col-12 col-lg-3 mb-3  justify-content-end"
              style={{padding: '0.3rem 0.6rem'}}>
              <div className="d-flex">Start Date</div>
              <Form.Control
                type="date"
                id="start_date"
                name="start_date"
                value={startDate}
                max={today}
                onChange={e => {
                  setStartDate(e.target.value);
                  setEndDate('');
                }}
              />
            </div>
            <div
              className=" col-12 col-lg-3 mb-3 justify-content-end"
              style={{padding: '0.3rem 0.6rem'}}>
              <div className="d-flex">End Date</div>
              <Form.Control
                type="date"
                id="end_date"
                name="end_date"
                value={endDate}
                min={startDate}
                max={today}
                onChange={e => {
                  setEndDate(e.target.value);
                }}
              />
            </div>

            <div
              className=" col-12 col-lg-6 mb-3 mt-3 px-3 d-flex justify-content-start"
              style={{paddingTop: '9px', paddingBottom: '6px'}}>
              {/* <div className=" col-12 col-lg-5 mb-3 mt-3 px-3 d-flex justify-content-start"> */}

              <Button
                title="Search"
                type="submit"
                variant="success"
                className="mx-2"
                id="add-btn"
                disabled={startDate === '' || endDate === ''}
                onClick={() => {
                  setReset(Number(Reset) + 1);
                }}>
                Search
                <i className="bi bi-search mx-1" aria-hidden="true" />
              </Button>
              <Button
                title="Reset"
                type="submit"
                variant="danger"
                id="add-btn"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setReset(0);
                }}>
                Reset
                <i
                  className="bi bi-arrow-counterclockwise mx-1"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </Col>
        </Row>
        <Widgets startDate={startDate} endDate={endDate} resetValue={Reset} />
        <Revenue />
        <RecentOrders />
      </Container>
    </div>
  );
};

export default Dashboard;
