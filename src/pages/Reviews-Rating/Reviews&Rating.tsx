import React from 'react';
import {Card} from 'react-bootstrap';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';

const ReviewsRating = ({reviews}: any): React.JSX.Element => {
  return (
    <ResponsiveMasonry
      className="row mx-1"
      style={{position: 'relative', height: '814.125px'}}
      data-masonry='{"percentPosition": true }'
      columnsCountBreakPoints={{350: 1, 750: 2, 900: 4}}>
      <Masonry
        className="col-xxl-3 col-lg-4 col-md-6"
        style={{position: 'absolute', top: '0px', left: '0%'}}>
        {reviews?.map((item: any, key: number) => (
          <Card className="mx-2 my-2" key={key}>
            <Card.Body>
              <img src={item.img} alt="" className="avatar-sm rounded" />
              <h5 className="mb-2 mt-3">{item.name}</h5>
              <div className="text-warning mb-3">
                <i className="ri-star-s-fill"></i>
                <i className="ri-star-s-fill"></i>
                <i className="ri-star-s-fill"></i>
                <i className="ri-star-s-fill"></i>
                <i className="ri-star-s-fill"></i>
              </div>
              <p className="mb-0 text-muted fs-15">{item.subTitle}</p>
            </Card.Body>
          </Card>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default ReviewsRating;
