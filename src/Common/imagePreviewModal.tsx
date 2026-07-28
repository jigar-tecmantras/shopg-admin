import React from 'react';
import { Modal } from 'react-bootstrap';

interface ImagePreviewModalProps {
  show: boolean;
  handleClose: () => void;
  image: string;
  title?: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  show,
  handleClose,
  image,
  title = 'Image Preview',
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="img-fluid rounded"
            style={{
              maxHeight: '75vh',
              objectFit: 'contain',
            }}
          />
        ) : (
          <p className="text-muted mb-0">No image available.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ImagePreviewModal;