import React from 'react';

const DeleteModal = (): JSX.Element => {
  return (
    <div
      className="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-body text-center p-5">
            Image
            <div className="mt-4">
              <h4 className="mb-3">You've made it!</h4>
              <p className="text-muted mb-4">
                {' '}
                The transfer was not successfully received by us. the email of
                the recipient wasn't correct.
              </p>
              <div className="hstack gap-2 justify-content-center">
                <a
                  href="javascript:void(0);"
                  className="btn btn-link link-success fw-medium"
                  data-bs-dismiss="modal">
                  <i className="ri-close-line me-1 align-middle"></i> Close
                </a>
                <a href="javascript:void(0);" className="btn btn-success">
                  Completed
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
