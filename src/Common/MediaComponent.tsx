import React from 'react';

interface MediaComponentProps {
  src: string;
  alt: string;
  className: string;
}

const MediaComponent: React.FC<MediaComponentProps> = ({
  src,
  alt,
  className,
}) => {
  const [hasError, setHasError] = React.useState(false);

  // Helper function to check if URL is a video
  const isVideo = (url: string): boolean => {
    if (url.length === 0) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext));
  };

  if (hasError || src.length === 0) {
    return (
      <div
        className={`${className} d-flex align-items-center justify-content-center bg-light`}>
        <i
          className="ri-image-line text-muted"
          style={{fontSize: '1.5rem'}}></i>
      </div>
    );
  }

  if (isVideo(src)) {
    return (
      <video
        className={className}
        muted
        onError={() => {
          setHasError(true);
        }}>
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        <source src={src} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        setHasError(true);
      }}
    />
  );
};

export default MediaComponent;
