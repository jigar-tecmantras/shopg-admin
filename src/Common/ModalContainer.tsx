import React from 'react';
import {Modal} from 'react-bootstrap';
interface ModalContainerProps {
  showModal: boolean;
  modalTitle: string;
  handleClose: any;
  modalBody: any; // Pass the modal body as a component
  isTemplate?: boolean | any | undefined;
  size?: any;
}

const ModalContainer = ({
  showModal,
  handleClose,
  modalBody,
  modalTitle,
  isTemplate,
  size,
}: ModalContainerProps): React.JSX.Element => {
  return (
    <div>
      <Modal
        id="showModal"
        className="fade zoomIn"
        data-testid="showModal"
        size={(isTemplate as boolean) ? size : 'lg'}
        show={showModal}
        onHide={handleClose}
        centered>
        <Modal.Header className="px-4 pt-4" role="closeModal" closeButton>
          <h5 className="modal-title fs-18" id="exampleModalLabel">
            {modalTitle}
          </h5>
        </Modal.Header>
        <Modal.Body className="p-4">{modalBody}</Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalContainer;
