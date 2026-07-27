import React, {useEffect, useRef, useState} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import CountUp from 'react-countup';
import Chart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';

const Revenue = (): any => {
  const [startDate, setStartDate] = useState(new Date());
  const selectedYear = moment(startDate).format('YYYY');
  const [cardData, setCardData]: any = useState();
  const [activeChart, setActiveChart] = useState<string>('');
  const inputRef: any = useRef(null);
  const inputRefByYear: any = useRef(null);

  const fetchDasboardData = async (): Promise<void> => {
    const resp: any = await ApiUtils.getDasbordData(
      `?date_filter=${selectedYear}`,
    );
    setCardData(resp?.data);
  };

  useEffect(() => {
    void fetchDasboardData();
  }, [startDate]);

  const series = [
    {
      name: 'Orders',
      data: cardData?.orderChartCount?.map((data: any) => {
        return data.count;
      }),
    },
    {
      name: 'Refunds',
      data: cardData?.refundChartOrder?.map((data: any) => {
        return data.count;
      }),
    },
    {
      name: 'Earnings',
      data: cardData?.earningChartOrer?.map((data: any) => {
        return data.count;
      }),
    },
  ];

  const conversationRatio: any =
    (cardData?.TotalOrderChartCount /
      (cardData?.orderCount + cardData?.refundOrderprice)) *
      100 !==
      0 || 0;

  const options: any = {
    chart: {
      height: 400,
      type: 'line',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: `Total Revenue of ${selectedYear}`,
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },

    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
  };
  const onChangeChartPeriod = (pType: any): void => {
    setActiveChart(pType.target.value);
  };
  useEffect(() => {
    if (inputRef?.current != null) {
      inputRef?.current?.setFocus();
    }
    if (inputRefByYear?.current != null) {
      inputRefByYear?.current?.setFocus();
    }
  }, [activeChart]);

  const handleDownloadByYear = async (dateString: any): Promise<void> => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    try {
      const response: any = await ApiUtils.downloadSalesReport(`year=${year}`);

      if (response?.data.report_file_url !== '') {
        toast.success(response.message);
        window.open(response.data.report_file_url, '_blank');
      } else {
        toast.error('Report not available');
      }

      setActiveChart('');
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleDownloadByMonth = async (dateString: any): Promise<void> => {
    const date = new Date(dateString);

    const month = date.getMonth() + 1;
    try {
      const response: any = await ApiUtils.downloadSalesReport(
        `month=${month}`,
      );
      // window.open(response.data.report_file_url, '_blank');
      if (response?.data.report_file_url !== '') {
        toast.success(response.message);
        window.open(response.data.report_file_url, '_blank');
      } else {
        toast.error('Report not available');
      }

      setActiveChart('');
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <Col xxl={12} className="order-last">
      <Card>
        <Card.Header className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Revenue</h4>
          <div className="d-flex gap-2 report-download">
            <div className="d-flex justify-content-between align-items-center gap-3 px-2 py-2">
              <div className="mb-1">
                <select
                  onChange={onChangeChartPeriod}
                  className="form-select me-2"
                  value={activeChart}>
                  <option value="" selected disabled>
                    Download Sales Report
                  </option>
                  <option value="monthly">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>
            {activeChart === 'monthly' ? (
              <div className="date-and-month-picker">
                <DatePicker
                  ref={inputRef}
                  selected={startDate}
                  onChange={handleDownloadByMonth}
                  showMonthYearPicker
                  dateFormat="M"
                  className="form-control"
                />
              </div>
            ) : activeChart === 'year' ? (
              <div className="date-and-month-picker">
                <DatePicker
                  ref={inputRefByYear}
                  selected={startDate}
                  onChange={handleDownloadByYear}
                  showYearPicker
                  dateFormat="yyyy"
                  className="form-control"
                />
              </div>
            ) : (
              ''
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col xxl={8}>
              <Chart
                // options={options}
                options={{
                  ...options,
                  legend: {
                    show: true,
                    onItemClick: {
                      toggleDataSeries: false, // ✅ prevents hiding series
                    },
                  },
                }}
                series={series}
                type="line"
                height="405"
                className="apex-charts"
              />
            </Col>
            <Col xxl={4}>
              <div className="d-flex align-items-center gap-3 mb-4 mt-3 mt-xxl-0">
                <div className="input-group d-flex" data-testid="year-picker">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: any) => {
                      setStartDate(date);
                    }}
                    showYearPicker
                    dateFormat="yyyy"
                    className="form-control"
                  />
                  <div className="input-group-text bg-primary border-primary text-white">
                    <i className="ri-calendar-2-line"></i>
                  </div>
                </div>
              </div>
              <Row className="g-0 text-center">
                <Col xs={6} sm={6}>
                  <div className="p-3 border border-dashed border-bottom-0">
                    <h5 className="mb-1">
                      <span className="counter-value" data-target="65802">
                        <CountUp
                          start={0}
                          end={cardData?.TotalOrderChartCount}
                          separator=","
                        />
                      </span>
                    </h5>
                    <p className="text-muted mb-0">Orders</p>
                  </div>
                </Col>

                <Col xs={6} sm={6}>
                  <div className="p-3 border border-dashed border-start-0 border-bottom-0">
                    <h5 className="mb-1">
                      ₹
                      <span className="counter-value" data-target="98851.35">
                        <CountUp
                          start={0}
                          end={cardData?.earningOrderPrice}
                          separator=","
                          decimals={2}
                        />
                      </span>
                    </h5>
                    <p className="text-muted mb-0">Earnings</p>
                  </div>
                </Col>

                <Col xs={6} sm={6}>
                  <div className="p-3 border border-dashed">
                    <h5 className="mb-1">
                      <span className="counter-value" data-target="2450">
                        <CountUp
                          start={0}
                          end={cardData?.refundOrderprice}
                          separator=","
                        />
                      </span>
                    </h5>
                    <p className="text-muted mb-0">Refunds</p>
                  </div>
                </Col>

                <Col xs={6} sm={6}>
                  <div className="p-3 border border-dashed border-start-0">
                    <h5
                      className={`mb-1 ${
                        conversationRatio > 10 ? 'text-success' : 'text-danger'
                      } `}>
                      <span className="counter-value" data-target="18.92">
                        <CountUp
                          start={0}
                          end={conversationRatio}
                          separator=","
                          decimals={2}
                        />
                      </span>
                      %
                    </h5>
                    <p className="text-muted mb-0">Conversation Ratio</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Revenue;
