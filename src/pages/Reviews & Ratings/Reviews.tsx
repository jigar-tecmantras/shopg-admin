import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Carousel,
  Col,
  Container,
  Modal,
  Row,
} from 'react-bootstrap';
import BreadCrumb from 'Common/BreadCrumb';
import {useParams} from 'react-router-dom';
import ApiUtils from 'api/ApiUtils';
import StarRating from 'Common/StarRating';
import DefaultImgPlaceholder from 'assets/images/default-placeholder.jpg';

interface Product {
  id: number;
  name: string;
  product_option: {
    product_option_value: Array<{
      product_review: Array<{
        id: number;
        title: string;
        comment: string;
        rating: number;
        customer_first_name: string;
        product_review_image: Array<{
          id: number;
          image: string;
        }>;
      }>;
    }>;
  };
}

const Reviews = (): JSX.Element => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedReview, setSelectedReview] = useState<any | null>(null); // To store the selected review
  const [showModal, setShowModal] = useState(false);

  const isImage = (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url?.toLowerCase()?.endsWith(ext));
  };

  const {id} = useParams();
  useEffect(() => {
    const fetchProduct = async (): Promise<void> => {
      try {
        const response: any = await ApiUtils.getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    void fetchProduct();
  }, [id]);

  // Function to handle click on a Card and set the selected review
  const handleCardClick = (review: any): void => {
    setSelectedReview(review);
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title="Reviews"
          pageTitle="Reviews & Ratings"
          pageLink="/reviews-ratings"
        />
        <Row className="mb-4">
          {product?.product_option.product_option_value?.map(
            (optionValue, optionValueId): any => (
              <React.Fragment key={optionValueId}>
                {optionValue.product_review?.map(
                  (reviewValue, reviewValueId) => (
                    <Col key={reviewValueId} xs={12} sm={6} md={4} lg={3}>
                      <Card
                        className="mx-2 my-2 review-card"
                        onClick={() => {
                          handleCardClick(reviewValue);
                        }}>
                        <Card.Body>
                          <h4 className="mb-2 mt-3">
                            <span className="bi bi-person" />
                            {reviewValue.customer_first_name}
                          </h4>
                          {reviewValue.product_review_image?.length > 0 ? (
                            isImage(
                              reviewValue.product_review_image[0]?.image,
                            ) ? (
                              <img
                                src={
                                  reviewValue.product_review_image[0]?.image ??
                                  DefaultImgPlaceholder
                                }
                                alt="Product Review Image"
                                height={140}
                                width={200}
                                onError={({currentTarget}) => {
                                  currentTarget.onerror = null;
                                  currentTarget.src = DefaultImgPlaceholder; // Fallback to placeholder on error
                                }}
                              />
                            ) : (
                              <video width="100%" controls>
                                <source
                                  src={
                                    reviewValue.product_review_image[0]?.image
                                  }
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            )
                          ) : (
                            <img
                              src={DefaultImgPlaceholder}
                              alt="No Review Available"
                              height={140}
                              width={200}
                            />
                          )}

                          {/* {isImage(reviewValue.product_review_image[0]?.image) ? (
                        <img
                          src={
                            reviewValue.product_review_image[0]?.image ??
                            DefaultImgPlaceholder
                          }
                          alt="Product Review Image"
                          height={140}
                          width={200}
                          onError={({currentTarget}) => {
                            currentTarget.onerror = null;
                            currentTarget.src = DefaultImgPlaceholder;
                          }}
                        />
                      ) : (
                        <video width="100%" controls>
                          <source
                            src={reviewValue.product_review_image[0]?.image}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      )} */}

                          <div className="text-warning mb-3 pt-2">
                            <StarRating
                              rating={reviewValue.rating ?? 0}
                              totalStars={5}
                            />
                          </div>

                          <p
                            className="mb-0 text-muted fs-15 overflow-hidden"
                            style={{
                              maxHeight: '100px',
                              height: '40px',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}>
                            {reviewValue.comment}
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  ),
                )}
              </React.Fragment>
            ),
          )}
        </Row>
        {/* Modal for detailed review */}
        <Modal
          data-testid="review-modal"
          show={showModal}
          onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {' '}
              <span className="bi bi-person" />
              {selectedReview?.customer_first_name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedReview?.title}</h5>
            <div className="text-warning mb-3">
              <StarRating rating={selectedReview?.rating ?? 0} totalStars={5} />
            </div>
            <p>{selectedReview?.comment}</p>
            {selectedReview?.product_review_image.length > 0 && (
              <Carousel
                wrap={false}
                indicators={false}
                controls={true}
                interval={1000}>
                {selectedReview?.product_review_image.map(
                  (image: any, index: number) => (
                    <Carousel.Item key={index} className="p-5" interval={1000}>
                      {isImage(image.image) ? (
                        <img
                          src={image.image}
                          alt={`Review Image ${index}`}
                          height={200}
                          width={500}
                          onError={({currentTarget}) => {
                            currentTarget.onerror = null;
                            currentTarget.src = DefaultImgPlaceholder;
                          }}
                        />
                      ) : (
                        <video width="100%" controls>
                          <source src={image.image} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </Carousel.Item>
                  ),
                )}
              </Carousel>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Reviews;
