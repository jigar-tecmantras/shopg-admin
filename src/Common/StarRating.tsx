import React from 'react';

interface StarRatingProps {
  rating: number;
  totalStars: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars,
}: StarRatingProps) => {
  const renderStars = (): React.ReactNode => {
    const stars = [];

    // Display 5 stars
    for (let i = 0; i < totalStars; i++) {
      // Determine if the current star should be filled, half-filled, or empty based on the rating
      const isFilled = i < Math.floor(rating);
      const isHalfFilled = i === Math.floor(rating) && rating % 1 >= 0.5; // Updated condition
      const isEmpty = rating < i + 1;

      stars.push(
        <span
          key={i}
          className={`text-warning fs-6 ${
            isFilled
              ? 'ri-star-s-fill'
              : isHalfFilled
                ? 'ri-star-half-line'
                : isEmpty
                  ? 'ri-star-s-line'
                  : ''
          }`}
        />,
      );
    }

    return stars;
  };

  return <div className="star-rating">{renderStars()}</div>;
};

export default StarRating;
