/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, {useEffect, useState} from 'react';
import {Container, Card, Row, Col, Button, Pagination} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import ApiUtils from 'api/ApiUtils';
import StarRating from 'Common/StarRating';
import DefaultImgPlaceholder from 'assets/images/default-placeholder.jpg';
import {toast} from 'react-toastify';
// import Flatpickr from 'react-flatpickr';

const ReviewsAndRatings: React.FC = (): JSX.Element => {
  document.title = 'Reviews & Ratings | Warehouse ';
  const navigate = useNavigate();
  const defaultPage = 1;
  const [products, setProducts] = useState([]);

  const [pageValue, setPageValue] = useState(defaultPage);

  const [totalRecords, setTotalRecords] = useState(defaultPage);
  const [searchTerm, setSearchTerm] = useState('');

  // Utility function to detect if a URL is an image or video
  const isImage = (url: string): boolean => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const isVideo = (url: string): boolean => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };
  // const [dateFilter, setDateFilter] = useState({
  //   startDate: '',
  //   endDate: '',
  // });
  const currentData = Math.ceil(totalRecords / 6);

  const fetchProducts: any = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.getProductList(
        `?page=${pageValue}&page_size=6&sort_direction=asc&search=${searchTerm}&display_rating=true`,
      );
      const data = response.data;
      setProducts(data.data);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleViewReviews = (productId: number, ratings: any): void => {
    if (ratings !== null) {
      navigate(`/reviews-ratings/${productId}`);
    } else {
      toast.error('No Reviews');
    }
  };

  const handleNextPagination = (pageSize: any): void => {
    if (currentData > 0 && currentData > pageSize) {
      setPageValue(pageSize + 1);
    }
  };
  const handlePrevPagination = (pageSize: any): void => {
    if (pageSize > 1 && currentData >= pageSize) {
      setPageValue(pageSize - 1);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [pageValue, searchTerm]); /* dateFilter */

  // const formatDate = (date: any): string => {
  //   const year = date.getFullYear();
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const day = date.getDate().toString().padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // };

  // const handleDateFunction = (e: any): void => {
  //   const inputStartDate = new Date(e[0]);
  //   const formattedStartDate = formatDate(inputStartDate);

  //   const inputEndDate = new Date(e[1]);
  //   const formattedEndDate = formatDate(inputEndDate);

  //   setDateFilter(v => ({
  //     ...v,
  //     startDate: formattedStartDate,
  //     endDate: formattedEndDate,
  //   }));
  // };

  const truncateText = (text: string, maxLength: number): any => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleClick = (product: any): any => {
    window.open(
      `${process.env.REACT_APP_FRONTEND_URL}/product/${product?.id}?option=${product?.product_option_value_id}`,
    );
  };

  return (
    <div className="page-content" data-testid="reviewAndRating">
      <Container fluid>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Reviews & Ratings</h4>
          <div className="d-flex align-items-center gap-2">
            {/* <Flatpickr
              className="form-control flatpickr-input w-100"
              placeholder="Select Date"
              onChange={handleDateFunction}
              options={{
                mode: 'range',
                dateFormat: 'd M, Y',
                maxDate: new Date(),
              }}
            /> */}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
              }}
              className="form-control mr-3"
              style={{maxWidth: '300px'}}
            />
          </div>
        </div>
        <Row>
          {products && products.length > 0 ? (
            <>
              {products.map((product: any) => (
                <Col md={6} lg={4} key={product?.id}>
                  <Card className="mb-3 card-animate">
                    <Card.Body>
                      <div className="d-flex justify-content-between gap-3">
                        {product.product_option_value_image?.image ? (
                          isImage(product.product_option_value_image.image) ? (
                            <Card.Img
                              src={product.product_option_value_image.image}
                              className="avatar-sm rounded"
                              onError={({currentTarget}) => {
                                currentTarget.onerror = null;
                                currentTarget.src = DefaultImgPlaceholder;
                              }}
                            />
                          ) : isVideo(
                              product.product_option_value_image.image,
                            ) ? (
                            <div
                              style={{
                                width: 60,
                                height: 60,
                                position: 'relative',
                              }}>
                              <video
                                width={60}
                                height={60}
                                className="avatar-sm rounded"
                                style={{objectFit: 'cover'}}
                                muted
                                onMouseOver={e => {
                                  void (e.target as HTMLVideoElement).play();
                                }}
                                onMouseOut={e => {
                                  (e.target as HTMLVideoElement).pause();
                                }}>
                                <source
                                  src={product.product_option_value_image.image}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  background: 'rgba(0,0,0,0.5)',
                                  borderRadius: '50%',
                                  width: '20px',
                                  height: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <i
                                  className="ri-play-fill text-white"
                                  style={{fontSize: '10px'}}></i>
                              </div>
                            </div>
                          ) : (
                            <Card.Img
                              src={DefaultImgPlaceholder}
                              className="avatar-sm rounded"
                            />
                          )
                        ) : (
                          <Card.Img
                            src={DefaultImgPlaceholder}
                            className="avatar-sm rounded"
                          />
                        )}
                        <p
                          style={{height: '60px', maxWidth: '260px'}}
                          onClick={() => {
                            handleClick(product);
                          }}
                          className="text-uppercase mb-3 fw-medium text-muted fs-14 clickable-text">
                          {truncateText(product.name, 50)}
                        </p>
                      </div>
                      <div className="mt-3 d-flex flex-column align-items-center">
                        {/* <h1>
                          {product?.rating ?? 0}/
                          <span style={{color: '#888'}}>5</span>
                        </h1> */}
                        <h5>
                          {product?.rating ?? 0}/
                          <span style={{color: '#888'}}>5</span>
                        </h5>
                        <StarRating
                          rating={product?.rating ?? 0}
                          totalStars={5}
                        />
                      </div>
                    </Card.Body>
                    <Button
                      role="viewAllReview"
                      onClick={() => {
                        handleViewReviews(product.id, product?.rating);
                      }}
                      className="btn btn-primary btn-sm">
                      View All Reviews
                    </Button>
                  </Card>
                </Col>
              ))}
            </>
          ) : (
            <>
              <h2>No Data Found</h2>
            </>
          )}
        </Row>

        <Row className="justify-content-end mt-3">
          <div className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev
                onClick={() => {
                  handlePrevPagination(pageValue);
                }}
                disabled={pageValue === 1}
              />
              <Pagination.Item active>{pageValue}</Pagination.Item>
              <Pagination.Next
                onClick={() => {
                  handleNextPagination(pageValue);
                }}
                disabled={
                  pageValue === currentData ||
                  products.length === 0 ||
                  pageValue > currentData
                }
              />
            </Pagination>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default ReviewsAndRatings;
